import { Router } from "express";
import { getWebhookUrl } from "../service/webhook.js";
import {auth} from "../middlewares/auth.js";

const router = Router();

router.post('/url', auth, getWebhookUrl);

export default router;