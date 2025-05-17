import mongoose, { Document, Schema } from 'mongoose';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  username: string;
  email: string;
  role: 'admin' | 'seller' | 'buyer' | 'superadmin';
  password: string;
  currency?: string;
  verified: boolean;
  generateAuthToken: () => string;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}


const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 1,
      maxlength: 20,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 5,
      maxlength: 255,
    },
    role: {
      type: String,
      required: true,
      enum: ['admin', 'seller', 'buyer', 'superadmin'],
      default: 'buyer',
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 255,
    },
    currency: {
      type: String,
      minlength: 3,
    },
    verified: {
      type: Boolean,
      default: false,
    }
  },
);


userSchema.methods.generateAuthToken = function (): string {
  const token = jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
  return token;
}

userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);

interface JUser {
  name: string;
  email: string;
  password: string;
}

function validateUser(user: JUser) {
  const schema = Joi.object({
    name: Joi.string().min(1).max(20).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(6).max(255).required(),
  });

  return schema.validate(user);
}



export default User;
export { validateUser };