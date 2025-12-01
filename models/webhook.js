import mongoose from "mongoose";

const webhookSchema = new mongoose.Schema({
  developerId: {
    type: String,
    required: true
  },
  webhookUrl: {
    type: String,
    required: true
  },
  webhookSecret: {
    type: String,
    unique: true,
    required: true
  }
});

const Webhook = mongoose.model('webhook', webhookSchema);

export default Webhook;