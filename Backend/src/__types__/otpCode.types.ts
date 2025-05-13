import { ZOtpCode } from "../schema/otpCode.schema";
import { ITimeStampAndId } from "./timestampAndId.types";

export type OtpPurpose = "signUp" | "login" | "passwordReset";

export interface IOtpCode extends ZOtpCode, ITimeStampAndId {
  purpose: OtpPurpose;
  expiresAt: Date;
}
