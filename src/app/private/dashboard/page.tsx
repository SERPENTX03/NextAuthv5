import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/getSession";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { phoneNumber } from "@/action/user";

const Dashboard = async () => {
  const session = await getSession();

  const user = session?.user;

  if (!user) redirect("/login");


  return (
    <section>
      <div className="my-10 flex justify-center">
        <form action={phoneNumber}>
          <Label htmlFor="phonenumber">กรอกเบอร์มือมือถือของท่าน</Label>
          <Input type="number" name="phonenumber" id="phonenumber" placeholder="Phonenumber" />
          <Button className="mt-2 w-full" type="submit">ยืนยัน</Button>
        </form>
      </div>
    </section>
  );
};

export default Dashboard;
