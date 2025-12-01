import Joi from 'joi';
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  developerId: {
    type: String,
    required: true
  },
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
    default: 0.0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Payment = mongoose.model('payment', paymentSchema);


export function validatePayment(payment) {
  const schema = Joi.object({
    developerId: Joi.string().required(),
    transactionRef: Joi.string().required(),
    accountNo: Joi.number().required(),
    amount: Joi.number().required()
  });

  return schema.validate(payment);
}