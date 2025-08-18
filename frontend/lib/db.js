import { dbConnect } from "./mongodb";
import mongoose from "mongoose";

export async function getDb() {
  await dbConnect();
  return mongoose.connection.db;
}
