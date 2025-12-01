import mongoose from 'mongoose';
import Joi from 'joi';


const initPaymentSchema = new mongoose.Schema({
  developerId: {
    type: String,
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
  expiryTime: {
    type: Number,
    required: true
  },
  paymentRef: {
    type: String,
    unique: true,
    required: true
  },
  transactionRef: {
    type: String,
    unique: true,
    required: true
  },
  amount: {
    type: Number,
    default: 0.0
  },
  fee: {
    type: Number,
    default: 0.0
  },
  customer: {
    type: Object,
    required: true
  },
  checkoutUrl: {
    type: String,
    unique: true,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


export const InitPayment = mongoose.model('init-payment', initPaymentSchema);


export function validateInitPayment(payment) {
  const schema = Joi.object({
    paymentRef: Joi.string().required(),
    email: Joi.string().email().required(),
    fullname: Joi.string().required(),
    amount: Joi.number().required()
  });

  return schema.validate(payment);
}