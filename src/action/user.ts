"use server";

import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { redirect } from "next/navigation";
import { hash } from "bcryptjs";
import { CredentialsSignin } from "next-auth";
import { signIn } from "@/auth";
import { getSession } from "@/lib/getSession";
import { registerSchema } from "@/lib/validation";

const login = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await signIn("credentials", {
      redirect: false,
      callbackUrl: "/",
      email,
      password,
    });
  } catch (error) {
    const someError = error as CredentialsSignin;
    console.error("Login error:", someError.cause);
  }

  redirect("/");
};
const register = async (_prevState: any, formData: FormData) => {
  const firstName = formData.get("firstname") as string;
  const lastName = formData.get("lastname") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validatedData = registerSchema.safeParse({
    firstName,
    lastName,
    email,
    password,
  });

  if (!validatedData.success) {
    return { error: validatedData.error.errors[0].message };
  }

  try {
    await connectDB();
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return { error: "User already exists" };
    }

    const hashedPassword = await hash(password, 12);

    await User.create({
      firstName: validatedData.data.firstName,
      lastName: validatedData.data.lastName,
      email: validatedData.data.email,
      password: hashedPassword,
    });

    return { success: "User created successfully! Redirecting..." };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "An error occurred during registration" };
  }
};
const phoneNumber = async (formData: FormData) => {
  const session = await getSession();
  if (!session || !session.user) {
    throw new Error("User not authenticated");
  }

  const userEmail = session.user.email;
  const userNumber = formData.get("phonenumber") as string;

  if (!userNumber) {
    throw new Error("Please provide a phone number");
  }

  await connectDB();

  // 🔹 ตรวจสอบว่าเบอร์ซ้ำหรือไม่
  const existingUser = await User.findOne({ phoneNumber: userNumber });
  if (existingUser) throw new Error("Phone number already exists");

  // 🔹 อัปเดตเบอร์โทรโดยใช้ `email` แทน `_id`
  const updatedUser = await User.findOneAndUpdate(
    { email: userEmail },
    { phoneNumber: userNumber }, 
    { new: true }
  );

  if (!updatedUser) throw new Error("User not found");

  console.log("Phone number added successfully 📱");

  return JSON.parse(JSON.stringify(updatedUser));
};

const fetchAllUsers = async () => {
  await connectDB();
  const users = await User.find({});
  return users;
};

export { register, login, fetchAllUsers, phoneNumber };
