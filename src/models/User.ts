import mongoose from "mongoose";
import { unique } from "next/dist/build/utils";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, select: false },
  role: { type: String , default: "user"  },
  image: { type: String },
  phoneNumber: { type: String, unique: true, sparse: true }, 
  
  
  // Google & Github Provider, -> Facebook, Twitter, Instagram
  authProviderId: { type: String },
});

export const User = mongoose.models?.User || mongoose.model("User", userSchema);
