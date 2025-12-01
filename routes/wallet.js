import { apiAuth } from "../middlewares/auth.js";
import { createWallet, walletPayment, getWalletBalance } from "../service/wallet.js";
import { Router } from "express";
const router = Router();

router.post('/create', apiAuth, createWallet);
router.post('/pay', walletPayment);
router.get('/get-balance/:walletId', apiAuth, getWalletBalance);

export default router;