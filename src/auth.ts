import NextAuth, { CredentialsSignin } from "next-auth";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import connectDB from "./lib/db";
import { User } from "./models/User";
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),

    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    Credentials({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      authorize: async (credentials) => {
        const email = credentials.email as string | undefined;
        const password = credentials.password as string | undefined;

        if (!email || !password) {
          throw new CredentialsSignin("Please provide both email & password");
        }

        await connectDB();

        const user = await User.findOne({ email }).select("+password +role");

        if (!user) {
          throw new Error("Invalid email or password");
        }

        if (!user.password) {
          throw new Error("Invalid email or password");
        }

        const isMatched = await compare(password, user.password);

        if (!isMatched) {
          throw new Error("Password did not matched");
        }

        const userData = {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          id: user._id,
        };

        return userData;
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async session({ session, token }) {
      if (token?.sub && token?.role) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },

    signIn: async ({ user, account }) => {
      try {
        await connectDB();
    
        if (account?.provider === "google" || account?.provider === "github") {
          const { email, name, image, id } = user;
          let alreadyUser = await User.findOne({ email });
    
          if (!alreadyUser) {
            // แยกชื่อเป็น firstName และ lastName
            const nameParts = name.split(" ");
            const firstName = nameParts[0] || "Unknown";
            const lastName = nameParts.slice(1).join(" ") || "User";
    
            alreadyUser = await User.create({
              firstName,
              lastName,
              email,
              image,
              authProviderId: id,
              role: "user", // กำหนด role ให้ชัดเจน
              password: null, // ไม่ต้องมี password สำหรับ OAuth
            });
          }
    
          return true;
        }
    
        if (account?.provider === "credentials") {
          return true;
        }
    
        return false;
      } catch (error) {
        console.error("Error during sign-in:", error);
        throw new Error("Sign-in failed");
      }
    },
  }
})
