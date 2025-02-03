import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { getSession } from "@/lib/getSession";
import { signOut } from "@/auth";

const Navbar = async() => {
  const session = await getSession();
  const user = session?.user;
  return (
    <nav className="px-2">
      <div className="max-w-7xl mx-auto rounded-none md:rounded-b-2xl bg-slate-600 py-6 text-white px-4">
        <div className="flex justify-between items-center">
          <Link className="hover:text-gray-200" href="/">
            My Serpent Website
          </Link>
          <ul className="flex space-x-4 items-center">
            {!user ? (
              <>
                <li>
                  <Link href="/login" className="hover:text-gray-200">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-gray-200">
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/private/dashboard"
                    className="hover:text-gray-200"
                  >
                    Dashboard
                  </Link>
                </li>
                <form action={async()=>{
                  "use server"
                  await signOut()
                }}>
                  <Button type="submit" variant={"ghost"}>
                    Logout
                  </Button>
                </form>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
