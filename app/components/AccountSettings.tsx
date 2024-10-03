import React from "react";
import { CardContent, CardFooter } from "./ui/card";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import Image from "next/image";
import { useAppStore } from "@/app/store";
import moment from "moment";

export default function AccountSettings() {
  const { user } = useAppStore();

  return (
    <>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center px-auto sm:space-x-4 p-2">
          <div className="relative w-16 h-16 rounded-full overflow-hidden">
            <Image
              src={user?.photoURL || "/placeholder.svg"}
              alt="User avatar"
              width={100}
              height={100}
              className="rounded-full object-cover"
            />
          </div>
          <Separator
            orientation="vertical"
            className="h-12 hidden sm:block bg-gray-400"
          />
          <div className="flex flex-col">
            <span className="text-lg font-semibold">
              {user?.displayName || "default"}
            </span>
            <span className="text-sm text-muted-foreground">
              {user?.email || "example@gmail.com"}
            </span>
            {user?.lastSignInTime && (
              <span className="text-xs text-muted-foreground">
                last sign in: {moment(user.lastSignInTime).fromNow()}
              </span>
            )}
            {user?.lastSignInTime && (
              <span className="text-xs text-muted-foreground">
                role: {user.role}
              </span>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="bg-red-500 hover:bg-red-600">Delete Account</Button>
      </CardFooter>
    </>
  );
}
