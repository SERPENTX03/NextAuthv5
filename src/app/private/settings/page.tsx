import { fetchAllUsers } from "@/action/user";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/getSession";
import { User } from "@/models/User";
import { redirect } from "next/navigation";
import React from "react";

const Settings = async () => {
  const session = await getSession();
  const user = session?.user;
  
  console.log(user)

  if (!user) redirect("/");

  if (user?.role !== "admin") return redirect("/private/dashboard");

  const allUsers = await fetchAllUsers();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">user</h1>
      <table className="w-full rounded shadow">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">First Name</th>
            <th className="p-2">Last Name</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {/* Here we'll render the users & would be able to delete them */}
          {allUsers?.map((user) => (
        <tr key={user._id}>
        <td className="p-2">{user.firstName}</td>
        <td className="p-2">{user.lastName}</td>
        <td className="p-2">
                  <form action={async ()=> {
                    "use server"
                    await User.findByIdAndDelete(user._id);
                  }}>
                    <Button>Delete</Button>
                  </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Settings;
