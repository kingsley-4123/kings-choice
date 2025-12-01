import Webhook from "../models/webhook.js";
import { generateWebhookSecret } from "../utils/randomKeyGenerators.js";
import { User } from "../models/user.js";
import WebhookLogs from "../models/webhookLogs.js";
import axios from "axios";

export async function getWebhookUrl(req, res) {
  const { webhookUrl } = req.body;
  const user = await User.findOne({ _id: req.user._id });
  if (!user) return res.status(404).json({ ok: false, message: 'Failed' });

  const webhookExist = await Webhook.findOne({developerId: user.developerId });
  if (webhookExist) {
    webhookExist.webhookUrl = webhookUrl;
    webhookExist.webhookSecret = await generateWebhookSecret();;
    await webhookExist.save();
  } else {
    const secret = await generateWebhookSecret();
    await Webhook.create({
      developerId: user.developerId,
      webhookUrl: webhookUrl,
      webhookSecret: secret
    });

  }
 
  res.status(200).json({ ok: true, message: "webhook data saved successfully" });
}


export async function sendWebhook(webhookUrl, payload, signature) {
  try {
    const response = await axios.post(webhookUrl, payload, {
      headers: {
        'X-Signature': signature,
        'Content-Type': 'application/json'
      },
      timeout: 10000 // 10 secs timeout to avoid hanging
    });

    if (response.status === 200) {
      console.log("Webhook delivered successfully");
      return true;
    } else {
      console.log("Webhook responded with non-200:", response.status);
      // Save webhook failure
      await WebhookLogs.create({
        webhookUrl,
        status: response.status,
        payload,
        success: false
      });
      return false;
    }

  } catch (err) {
    console.log("Webhook failed:", err.message);

    // Save failure for retry later
    await WebhookLogs.create({
      webhookUrl,
      status: err.response?.status || null,
      payload,
      success: false,
      error: err.message
    });

    return false;
  }
}
