import mongoose from "mongoose";
import Joi from "joi";

const walletSchema = new mongoose.Schema({
  developerId: {
    type: String,
    required: true
  },
  walletId: {
    type: String,
    unique: true,
    required: true
  },
  accountNo: {
    type: Number,
    unique: true,
    required: true
  },
  bankName: {
    type: String,
    required: true
  },
  nin: {
    type: Number,
    required: true
  },
  walletName: {
    type: String,
    required: true
  },
  customer: {
    type: Object,
    required: true
  },
  balance: {
    type: Number,
    default: 0.0
  }
});


export const Wallet = mongoose.model('wallet', walletSchema);


export function validateWallet(wallet) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    phone: Joi.string().min(11).max(11).required(),
    fullname: Joi.string().required(),
    walletName: Joi.string().required(),
    nin: Joi.string().min(11).max(11).required()
  });

  return schema.validate(wallet);
} 