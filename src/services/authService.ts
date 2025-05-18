import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import User, {IUser} from "../models/User.js";
import generateToken from "../utils/generateToken.js";
// import generateUser from "../utils/createUse";
// import { validateLogin } from "../validators/userValidato";
import _ from 'lodash';
// import { sendMailService } from "./mailService";


interface LoginBody {
  email: string;
  password: string;
}

interface LoginResult {
  _id: string;
  username: string;
  email: string;
  token: string;
}

interface RegisterResult {
  token: string;
  user: Pick<IUser, "_id" | "username" | "email">;
}

interface MailParam {
  name: string;
  email: string;
}


async function loginUserService(reqa: Request, res: Response, body: LoginBody): Promise<LoginResult> {
  // const { error } = validateLogin(body);
  // if (error) {
  //   res.status(400);
  //   throw new Error("Validation error");
  // }
  const { email, password } = body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const passwordMatched = await user.matchPassword(password);
  if (!passwordMatched) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  return {
    _id: user._id as string,
    username: user.username,
    email: user.email,
    token: generateToken(user._id as string, user.role)
  }
}

async function registerUserService(req: Request, res: Response, body: Partial<IUser>): Promise<RegisterResult> {
  let user = await generateUser(req, res, body);

  const token = generateToken(user._id as string, user.role);

  return { 
    token,
    user: _.pick(user, ["_id", "username", "email"]) as Pick<IUser, "_id" | "username" | "email">};
}

async function sendRegistrationMail(req: Request, res: Response, mailParam: MailParam) {
  const subject = `Greensol Dev: Confirm Registration!`
  const content = `Hi ${mailParam.name},\nYou have sucessfully registered on the greensol api-dev website\nLook forward to an amazing experience!`
  const mailContent = {
    subject: subject,
    text: content,
    mail: mailParam.email,
  }
  // await sendMailService(req, res, mailContent);
}

async function generateUser(req: Request, res: Response, body: Partial<IUser>) {
  const { username,firstname, lastname, email, password, role } = body;
  // if ((req.user.role === "admin" || "buyer" && role === "admin" || "superadmin") || role === "superadmin") {
  //   res.status(400);
  //   throw new Error("User not authorized to create users");
  // }
  let user = await User.findOne({ email: email });
  if (user) {
      res.status(400);
      throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password as string, salt);

  user = new User({
    username,
    firstname,
    lastname,
    email,
    password: hashedPassword,
    role: role || 'buyer',
    verified: false,
  });

  const createdUser = await user.save();
  return createdUser;
}

export { loginUserService, registerUserService, sendRegistrationMail };