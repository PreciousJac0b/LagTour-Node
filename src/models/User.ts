import mongoose, { Document, Schema, Types } from 'mongoose';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


interface Experience {
  company: string;
  role: string;
  startDate: Date;
  endDate?: Date;
}

export interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  firstname: string;
  lastname: string;
  role: 'student' | 'lecturer' | 'admin' | 'superadmin';
  bio: string;
  skills: string[];
  experience: Experience[];
  resumeUrl?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  faculty: Types.ObjectId;
  department: Types.ObjectId;
  posts: Types.ObjectId[];
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
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
    firstname: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 20,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
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
      enum: ['admin', 'student', 'lecturer', 'superadmin'],
      default: 'student',
    },
    skills: {
      type: [String],
      default: [],
    },
    experience: [
      {
        company: {
          type: String,
          required: true
        },
        role: {
          type: String,
          required: true
        },
        startDate: {
          type: Date,
          required: true
        },
        endDate: {
          type: Date
        },
      }
    ],
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 255,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
     resumeUrl: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    faculty: {
      type: Schema.Types.ObjectId,
      ref: 'Faculty',
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Follow',
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Follow',
      },
    ],
  },
  {
    timestamps: true,
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