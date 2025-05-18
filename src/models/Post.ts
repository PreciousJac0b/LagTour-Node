import { Schema, model, Types, Document } from 'mongoose';

export interface IPost extends Document {
  title: string;
  description: string;
  type: string;
  applicationUrl: string;
  deadline: Date;
  isSuperPost: boolean;
  createdBy: Types.ObjectId;
  category: Types.ObjectId;
  likes: Types.ObjectId[];
  reposts: Types.ObjectId[];
  comments: Types.ObjectId[];
}

const postSchema = new Schema<IPost>({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  applicationUrl: {
    type: String,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  isSuperPost: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Like'
    }
  ],
  reposts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Repost'
    }
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ],
}, {
  timestamps: true
});

export const Post = model<IPost>('Post', postSchema);
