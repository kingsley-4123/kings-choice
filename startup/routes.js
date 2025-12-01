import express from "express";
import helmet from 'helmet';
import cors from "cors";
import errorHandler from "../middlewares/error.js";
import signupHandler from '../routes/user.js';
import loginHandler from '../routes/login.js';
import webhookHandler from '../routes/webhook.js';
import initPaymentHandler from '../routes/init-payment.js';
import walletHandler from '../routes/wallet.js';

export default function routeHandler(app) {
  app.use(express.json());
  app.use(helmet());
  app.use(cors({ origin: process.env.ORIGIN, credentials: true }));

  app.use("/v1/api/signup", signupHandler);
  app.use("/v1/api/login", loginHandler);
  app.use("/v1/api/webhook", webhookHandler);
  app.use('/v1/api/init-payment', initPaymentHandler);
  app.use('/v1/api/wallet', walletHandler);
  app.use(errorHandler);
}