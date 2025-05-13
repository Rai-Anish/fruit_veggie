import { ZVendor } from "../schema/vendor.schema";
import { ITimeStampAndId } from "./timestampAndId.types";
import { Types } from "mongoose";

type status = "pending" | "approved" | "rejected";

export interface IVendor extends ZVendor, ITimeStampAndId {
  user: Types.ObjectId;
  idDocument: string;
  isApproved?: boolean;
  accountApproval?: {
    status: status;
  };
}
