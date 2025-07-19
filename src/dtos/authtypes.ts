import { IUser } from "models/User.js";

export interface LoginBody {
  email: string;
  password: string;
}

export interface LoginResult {
  _id: string;
  username: string;
  email: string;
  token: string;
}

export interface RegisterResult {
  token: string;
  user: Pick<IUser, "_id" | "username" | "email">;
}

export interface MailParam {
  name: string;
  email: string;
}