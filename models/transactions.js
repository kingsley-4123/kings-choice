import Joi from 'joi';
import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  transactionRef: {
    type: String,
    unique: true,
    required: true
  },
  accountNo: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  fee: {
    type: Number,
    required: true
  },
  customer: {
    type: Object,
    required: true
  }
});

export const Transactions = mongoose.model('transactions', transactionSchema);


export function validateTransaction(transaction) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    fullname: Joi.string().required(),
    phone: Joi.string().min(11).max(11).required(),
    amount: Joi.number().required(),
    accountNo: Joi.number().required()
  });

  return schema.validate(transaction);
}