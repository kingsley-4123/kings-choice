import { Router } from "express";
import { initPayment, makeInitPayment, verifyInitPayment } from "../service/init-payment.js";
import { apiAuth } from "../middlewares/auth.js";
const router = Router();

router.post('/', apiAuth, initPayment);
router.post('/pay', makeInitPayment);
router.post('/verify', verifyInitPayment);

export default router;