import { login } from "@/action/user";
import {  signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSession } from "@/lib/getSession";
import { GithubIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { BsGoogle } from "react-icons/bs";


const LoginPage = async() => {

  const session = await getSession()

  const user = session?.user;

  if (user) redirect('/')

  return (
    <div>
      <div
        className="mt-10 max-w-md w-full 
  mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input 
  bg-white border border-[#121212] dark:bg-black"
      >
        <form action={login} className="my-8">
          <Label htmlFor="email">Email Address</Label>
          <Input
            className="my-2 "
            id="email"
            placeholder="Your's Email"
            type="email"
            name="email"
          />
          <Label htmlFor="password">Password</Label>
          <Input
            className="mt-2"
            id="password"
            placeholder="**********"
            type="password"
            name="password"
          />
          <Button className="mt-8 mb-2 w-full h-10">Sign up &rarr;</Button>
          <p>
            Dont't have account? <Link href="/register">Register</Link>
          </p>
        </form>
        <div className="bg-gradient-to-r from-transparent
         via-neutral-300 to-transparent my-8 h-[1px] w-full">        </div>

            <section>
                <form action={async ()=>{
                  "use server"

                  await signIn('github')
                }} className="my-4">
                    <Button className="w-full" type="submit">
                        <GithubIcon className="h-full w-full"/>
                    </Button>
                </form>
                <form action={async ()=> {
                  "use server"

                  await signIn('google')
                }} className="my-4">
                    <Button className="w-full" type="submit">
                        <BsGoogle className="h-full w-full"/>
                    </Button>
                </form>
            </section>
      </div>
    </div>
  );
};

export default LoginPage;
