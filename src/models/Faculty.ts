import { Schema, model, Types, Document } from 'mongoose';

export interface IFaculty extends Document {
  name: string;
  departments: Types.ObjectId[];
}

const facultySchema = new Schema<IFaculty>({
  name: {
    type: String,
    required: true
  },
  departments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Department'
    }
  ],
});

export const Faculty = model<IFaculty>('Faculty', facultySchema);