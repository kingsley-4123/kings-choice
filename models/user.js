import mongoose from "mongoose";

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
    type: true,
    unique: true,
    required: true
  },
  phoneNo: {
    type: Number,
    required: true
  },
  country: {
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
  }
});

