import { Document, Types } from "mongoose";

export interface ITimeStampAndId extends Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
