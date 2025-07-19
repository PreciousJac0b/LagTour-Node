import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import User, {IUser} from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import _ from 'lodash';
import {LoginBody, LoginResult, RegisterResult, MailParam} from "../dtos/authtypes.js";


export class AuthService {
  static async loginUserService(reqa: Request, res: Response, body: LoginBody): Promise<LoginResult> {
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

  static async registerUserService(req: Request, res: Response, body: Partial<IUser>): Promise<RegisterResult> {
    let user = await this.generateUser(req, res, body);

    const token = generateToken(user._id as string, user.role);

    return { 
      token,
      user: _.pick(user, ["_id", "username", "email"]) as Pick<IUser, "_id" | "username" | "email">};
  }

  static async sendRegistrationMail(req: Request, res: Response, mailParam: MailParam) {
    const subject = `Greensol Dev: Confirm Registration!`
    const content = `Hi ${mailParam.name},\nYou have sucessfully registered on the greensol api-dev website\nLook forward to an amazing experience!`
    const mailContent = {
      subject: subject,
      text: content,
      mail: mailParam.email,
    }
    // await sendMailService(req, res, mailContent);
  }

  static async generateUser(req: Request, res: Response, body: Partial<IUser>) {
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

}
