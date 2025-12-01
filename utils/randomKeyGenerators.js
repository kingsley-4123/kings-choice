import { v4 as uuidv4 } from "uuid";
import { User } from "../models/user.js";
import Webhook from "../models/webhook.js";
import { Wallet } from "../models/wallet.js";
import { InitPayment } from "../models/init-payment.js";
import { nanoid } from "nanoid";
import crypto from 'crypto';

export async function generatePublicKey() {
  let pubKey;
  let exist = true;

  while (exist) {
    pubKey = "pk_"+uuidv4();
    exist = await User.findOne({ publicKey: pubKey });
  }
  return pubKey;
}


export async function generateSecretKey() {
  let secretKey;
  let exist = true;

  while (exist) {
    secretKey = "sk_"+uuidv4();
    exist = await User.findOne({secretKey: secretKey});
  }
  return secretKey;
}


export async function generateDevId() {
  let devId;
  let exist = true;

  while (exist) {
    devId = "dev_" + nanoid(10);
    exist = await User.findOne({ developerId: devId });
  }
  return devId;
}


export async function generateWebhookSecret() {
  let webhookSec;
  let exist = true;

  while (exist) {
    webhookSec = "whs_" + nanoid();
    exist = await Webhook.findOne({ webhookSecret: webhookSec });
  }
  return webhookSec;
}


export async function generateWalletId() {
  let walletId;
  let exist = true;

  while (exist) {
    walletId = 'wid_' + nanoid();
    exist = await Wallet.findOne({ walletId: walletId });
  }
  return walletId;
}


export async function generateUniqueRandomAccountNo() {
  let acc = '';
  let exists = true;
  let accNo;

  // First digit 1-9
  acc += Math.floor(Math.random() * 9) + 1;

  while (exists) {
    for (let i = 0; i < 9; i++){
      acc += Math.floor(Math.random() * 10);  // 0-9
    }
    accNo = Number(acc);
    let initPay = await InitPayment.findOne({ accountNo: accNo });
    if (!initPay || initPay.expiryTime < Date.now()) {
      exists = false;
    }
  }
  return accNo;
}


export async function generateUniqueTrxRef() {
  let trxf;
  let exists = true;

  while (exists) {
    trxf = 'trx-ref_' + uuidv4();
    exists = await InitPayment.findOne({ transactionRef: trxf });
  }

  return trxf;
}


export function generateBankName() {
  const bankNames = ['Access Bank', 'Wema Bank', 'Union Bank', 'UBA Bank', 'Sterling Bank', 'Polaris Bank', 'Zenith Bank', 'First Bank', 'FCMB Bank', 'GTB Bank'];
  const randNum = Math.floor(Math.random() * bankNames.length);
  return bankNames[randNum];
}


export function generateWebhookSignature(webhookSecret, payload) {
  const hmac = crypto.createHmac('sha256', webhookSecret);
  hmac.update(payload);
  const signature = hmac.digest('hex');
  return signature;
}