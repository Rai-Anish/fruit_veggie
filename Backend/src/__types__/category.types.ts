import { Types } from "mongoose";
import { ITimeStampAndId } from "./timestampAndId.types";

export interface ICategory extends ITimeStampAndId {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  parentCategory?: Types.ObjectId;
}
