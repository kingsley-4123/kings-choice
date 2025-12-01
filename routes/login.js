import { Router } from "express";
import { login } from "../service/user.js";

const router = Router();

router.post("/", login);

export default router;