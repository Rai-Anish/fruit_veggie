import { ZUser } from "../schema/user.schema";
import { ITimeStampAndId } from "./timestampAndId.types";

export interface IUser extends ZUser, ITimeStampAndId {
  checkPassword(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}
