import {signup} from "../service/user.js";
import { Router } from "express";

const router = Router();

router.post('/', signup);

export default router;