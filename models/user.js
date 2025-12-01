import mongoose from "mongoose";
import Joi from "joi";
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  phoneNo: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  nin: {
    type: String,
    required: true 
  },
  developerId: {
    type: String,
    unique: true,
    required: true
  },
  publicKey: {
    type: String,
    unique: true,
    required: true
  },
  secretKey: {
    type: String,
    unique: true,
    required: true
  },
  balance: {
    type: Number,
    default: 0.0
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.methods.generateToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });
}

export const User = mongoose.model('user', userSchema);


export function validateUser(user) {
  const schema = Joi.object({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().email().required(),
    phoneNo: Joi.string().required(),
    country: Joi.string().required(),
    nin: Joi.string().required(),
    password: Joi.string().required()
  });

  return schema.validate(user);
}

