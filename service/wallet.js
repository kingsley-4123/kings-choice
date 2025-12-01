import { validateWallet } from "../models/wallet.js";
import { generateWalletId, generateBankName, generateUniqueTrxRef, generateWebhookSignature } from "../utils/randomKeyGenerators.js";
import { Wallet } from "../models/wallet.js";
import { checkFee } from "../utils/feeCalculator.js";
import { Transactions, validateTransaction } from "../models/transactions.js";
import Webhook from "../models/webhook.js";
import { sendWebhook } from "./webhook.js";
import lodash from 'lodash';


export async function createWallet(req, res) {
  const { error } = validateWallet(req.body);
  if (error) return res.status(400).json({ ok: false, message: error.details[0].message });

  const { fullname, walletName, phone, email, nin } = req.body;

  const walletId = await generateWalletId();
  const bankName = generateBankName();

  const wallet = new Wallet({
    developerId: req.dev.developerId,
    walletId,
    accountNo: phone.slice(1,),
    bankName,
    nin,
    walletName,
    customer: {
      fullname,
      email,
      phone
    }
  });

  await wallet.save();

  res.json({
    ok: true, 
    message: 'Success',
    responseBody: lodash.pick(wallet, ['walletId', 'walletName', 'accountNo', 'bankName', 'customer'])
  });

}


export async function walletPayment(req, res) {
  const { error } = validateTransaction(req.body);
  if (error) return res.status(400).json({ ok: false, message: error.details[0].message });

  const { email, fullname, phone, accountNo, amount } = req.body;

  const wallet = await Wallet.findOne({ accountNo: accountNo });
  if (!wallet) return res.status(404).json({ ok: false, message: "Couldn't find wallet associated with this accountNo" });

  const transactionRef = await generateUniqueTrxRef();
  const fee = checkFee(amount);

  await Transactions.create({
    transactionRef,
    accountNo,
    amount,
    fee,
    customer: {
      phone,
      fullname,
      email
    }
  });

  wallet.balance += amount - fee;
  await wallet.save();

  res.json({ ok: true, message: 'Success' });

  const webhook = await Webhook.findOne({ developerId: wallet.developerId });
  if (!webhook) return res.status(404).json({ ok: false, message: 'No registered webhookUrl found' });

  const payload = JSON.stringify({
    ok: true,
    message: 'Success',
    responseBody: {
      transactionRef,
      walletId: wallet.walletId,
      accountNo,
      walletName: wallet.walletName,
      amount,
      fee,
      customer: {
        phone,
        fullname,
        email
      }
    }
  });

  const signature = generateWebhookSignature(webhook.webhookSecret, payload);
  console.log('WALLET_SIGNATURE', signature);

  const result = await sendWebhook(webhook.webhookUrl, payload, signature);
  console.log(result);
}


export async function getWalletBalance(req, res) {
  const { walletId } = req.params;

  const wallet = await Wallet.findOne({ walletId: walletId });
  if (!wallet) return res.status(404).json({ ok: false, message: "Couldn't find wallet associated with this walletId" });

  res.json({
    ok: true,
    message: "Success",
    responseBody: {
      balance: wallet.balance,
      customer: wallet.customer
    }
  });
}