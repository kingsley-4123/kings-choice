import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export function auth(req, res, next) {
  try {
    // Header names are lower case automatically in Express.
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ message: "Invalid token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();  
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "Token Issue..." });
  }
}


export async function apiAuth(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: 'Authorization header missing' });

    const [type, secKey] = authHeader.split(" ");

    if (type !== 'Bearer' || !secKey) return res.status(401).json({ message: "Invalid Authorization format" });

    const decoded = await User.findOne({ secretKey: secKey });
    if (!decoded) return res.status(400).json({ message: 'Invalid secret key' });

    req.dev = decoded;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "Authentication Issue..." });
  }
}
