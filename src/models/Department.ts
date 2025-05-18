import { Schema, model, Types, Document } from 'mongoose';

interface Resource {
  title: string;
  url: string;
}

export interface IDepartment extends Document {
  name: string;
  description: string;
  bannerUrl: string;
  resources: Resource[];
  faculty: Types.ObjectId;
}

const departmentSchema = new Schema<IDepartment>({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  bannerUrl: {
    type: String,
    required: true
  },
  resources: [
    {
      title: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      },
    },
  ],
  faculty: {
    type: Schema.Types.ObjectId,
    ref: 'Faculty',
    required: true
  },
});

export const Department = model<IDepartment>('Department', departmentSchema);
