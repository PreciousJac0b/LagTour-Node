import asyncHandler from "express-async-handler";
import { AuthService } from "../services/authService.js";
// import { sendRegistrationMail } from "../services/authService.js";
import { Request, Response } from "express";


export class AuthController {
  static registerUser = asyncHandler(async (req: Request, res: Response) => {

    const {token, user} = await AuthService.registerUserService(req, res, req.body);

    const mailContent = {
      name: req.body.username,
      email: req.body.email
    }
    
    await AuthService.sendRegistrationMail(req, res, mailContent);

    res.header('x-auth-token', token).status(201).send(user);
  });


  static loginUser = asyncHandler(async (req: Request, res: Response) => {
    const data = await AuthService.loginUserService(req, res, req.body);

    res.json(data);
  })

}