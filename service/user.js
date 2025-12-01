import { User, validateUser } from "../models/user.js";
import lodash from "lodash"
import bcrypt from "bcrypt";
import Joi from "joi";
import { generateDevId, generatePublicKey, generateSecretKey } from "../utils/randomKeyGenerators.js";

export async function signup(req, res) {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { email } = req.body;
  const checkUser = await User.findOne({ email: email });
  if (checkUser) return res.status(400).json({ message: "User already exists" });

  const user = new User(lodash.pick(req.body, ['firstname', 'lastname', 'country', 'email', 'phoneNo', 'nin']));
  user.password = await bcrypt.hash(req.body.password, 12);
  user.developerId = await generateDevId();
  user.publicKey = await generatePublicKey();
  user.secretKey = await generateSecretKey();

  const token = user.generateToken();
  await user.save();

  res.status(200).json({ ok: true, token, message: "Registration successful" });
}

export async function login(req, res) {
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { email, password } = req.body;

  const checkEmail = await User.findOne({ email: email });
  if (!checkEmail) return res.status(400).json({ message: "Invalid email or password" });

  const checkPassword = await bcrypt.compare(password, checkEmail.password);
  if (!checkPassword) return res.status(400).json({ message: "Invalid email or password" });
  
  const token = checkEmail.generateToken();

  res.status(200).json({ ok: true, token, message: "Login Successful" });
}


function validateLogin(user) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  return schema.validate(user);
}
