import mongoose from "mongoose";
import { Request, Response } from "express";

export const dbConnect = async (req: Request, res: Response) => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connection to database successful: ${conn.connection.host}`);
    console.log(`Database name: ${conn.connection.name}`);
  } catch (error) {
    console.log("Error while connecting to databse");
    process.exit(1);
  }
};
