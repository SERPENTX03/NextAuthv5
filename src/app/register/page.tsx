"use client";

import { register } from "@/action/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast"; 
import Link from "next/link";
import { useActionState, useEffect } from "react";

const Register = () => {
  const { toast } = useToast(); 
  const [state, formAction] = useActionState(register, null); 

  useEffect(() => {
    if (state?.error) {
      toast({ variant: "destructive", title: "Error", description: state.error });
    }
    if (state?.success) {
      toast({ title: "Success", description: state.success });
      setTimeout(() => {
        window.location.href = "/login"; 
      }, 2000);
    }
  }, [state, toast]);

  return (
    <div className="mt-10 max-w-md w-full mx-auto p-8 bg-white dark:bg-black border border-[#121212] rounded-2xl shadow-input">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">Welcome to My Shop</h2>
      <p className="text-neutral-600 text-sm dark:text-neutral-300">Please provide the necessary information</p>
      
      <form action={formAction} className="my-8">
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <div className="flex flex-col">
            <Label className="mb-2" htmlFor="firstname">First Name</Label>
            <Input id="firstname" placeholder="Your Name" type="text" name="firstname" />
          </div>
          <div className="flex flex-col">
            <Label className="mb-2" htmlFor="lastname">Last Name</Label>
            <Input id="lastname" placeholder="Your Last Name" type="text" name="lastname" />
          </div>
        </div>

        <Label htmlFor="email">Email Address</Label>
        <Input className="mt-2" id="email" placeholder="Your Email" type="email" name="email" />

        <Label htmlFor="password">Password</Label>
        <Input className="mt-2" id="password" placeholder="**********" type="password" name="password" />

        <Button className="mt-8 w-full h-10">Sign up &rarr;</Button>
        <p className="mt-4">Already have an account? <Link href="/login" className="text-blue-600">Login</Link></p>
      </form>
    </div>
  );
};

export default Register;
