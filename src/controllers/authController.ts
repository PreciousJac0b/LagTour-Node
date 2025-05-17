import asyncHandler from "express-async-handler";
import { loginUserService, registerUserService } from "../services/authService.js";
import { sendRegistrationMail } from "../services/authService.js";
import { Request, Response } from "express";

const registerUser = asyncHandler(async (req: Request, res: Response) => {

  const {token, user} = await registerUserService(req, res, req.body);

  const mailContent = {
    name: req.body.username,
    email: req.body.email
  }
  
  await sendRegistrationMail(req, res, mailContent);

  res.header('x-auth-token', token).status(201).send(user);
});


const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const data = await loginUserService(req, res, req.body);

  res.json(data);
})

export { registerUser, loginUser };