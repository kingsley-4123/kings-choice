import { InitPayment, validateInitPayment } from "../models/init-payment.js";
import { generateUniqueRandomAccountNo, generateUniqueTrxRef, generateBankName, generateWebhookSignature } from "../utils/randomKeyGenerators.js";
import { checkFee } from "../utils/feeCalculator.js";
import { Payment, validatePayment } from "../models/payment.js";
import { User } from "../models/user.js";
import Webhook from "../models/webhook.js";
import { sendWebhook } from "./webhook.js";
import lodash from "lodash";


/**
 * save the actual amount and fee differently.
 * After the user makes payment and clicks I have payed 
 * I will check if the actual amount + fee in initPayment table is = to amount in Payment table.
 */
export async function initPayment(req, res) {
  const { error } = validateInitPayment(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { paymentRef, amount, fullname, email } = req.body;
  const transactionRef = await generateUniqueTrxRef();
  const accountNo = await generateUniqueRandomAccountNo();
  const checkoutUrl = `${process.env.CHECKOUT_PAGE}/${transactionRef}`;
  const fee = checkFee(amount);
  const bankName = generateBankName();

  const initPay = new InitPayment({
    developerId: req.dev.developerId,
    accountNo,
    bankName,
    expiryTime: Date.now() + 60 * 60 * 1000,
    paymentRef,
    transactionRef,
    amount,
    fee,
    checkoutUrl,
    customer: {
      fullname,
      email
    }
  });

  await initPay.save();

  res.json({
    ok: true,
    message: 'Success',
    body: lodash.pick(initPay, ['transactionRef', 'paymentRef', 'checkoutUrl'])
  });
}


/** When the user clicks the payment btn from checkout page. Take the developerId, accoutNo, and trasactionRef
 * whic were generated when the user opened the checkout page.
 */
export async function makeInitPayment(req, res) {
  const { error } = validatePayment(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const {transactionRef, accountNo, developerId, amount} = req.body;

  await Payment.create({
    developerId,
    transactionRef,
    accountNo,
    amount
  });

  res.json({
    ok: true,
    message: "Success"
  });
  
}


/**
 * In the checkout page there will be the Amount+fee , Bank Name, the random accountNo.
 * When user clicks I have Paid, Take the transactionRef in url, and the amount nd send them to backend.
 */
export async function verifyInitPayment(req, res) {
  const { transactionRef } = req.body;
  const now = Date.now();

  const payment = await Payment.findOne({ transactionRef: transactionRef });
  if (!payment) return res.status(404).json({ok: false, message: 'Failed' });

  const checkInit = await InitPayment.findOne({ transactionRef: transactionRef });
  if (!checkInit) return res.status(404).json({ ok: false, message: 'Failed' });

  const requiredAmount = checkInit.amount + checkInit.fee;
  console.log('Required', requiredAmount, 'Payment', payment.amount);

  if (payment.amount !== requiredAmount) return res.status(400).json({ ok: false, message: "Amount not complete" });
  if (now > checkInit.expiryTime) return res.status(400).json({ ok: false, message: 'Account number expired' });

  res.status(200).json({ ok: true, message: 'Verification successful' });

  const user = await User.findOne({ developerId: checkInit.developerId });
  if (!user) return res.status(404).json({ ok: false, message: "User not found" });
  user.balance = payment.amount;
  await user.save();
  
  const webhook = await Webhook.findOne({ developerId: user.developerId });
  if (!webhook) return res.status(404).json({ ok: false, message: 'No webhookUrl registered' });

  const payload = JSON.stringify({
    ok: true,
    message: 'Success',
    responseBody: lodash.pick(checkInit, ['transactionRef', 'paymentRef', 'amount', 'fee', 'customer'])
  });

  const signature = generateWebhookSignature(webhook.webhookSecret, payload);
  console.log('INIT_SIGNATURE', signature);

  const webhookRes = await sendWebhook(webhook.webhookUrl, payload, signature);
  console.log('WEBHOOK_RESPONSE', webhookRes);
}
