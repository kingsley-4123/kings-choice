import mongoose from "mongoose";

const webhookLogsSchema = new mongoose.Schema({
  webhookUrl: String,
  payload: Object,
  status: Number,
  success: Boolean,
  error: String,
  createdAt: { type: Date, default: Date.now }
});

const WebhookLogs = mongoose.model('webhookLogs', webhookLogsSchema);

export default WebhookLogs;