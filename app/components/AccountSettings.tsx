import React, { useState } from "react";
import { CardContent, CardFooter } from "./ui/card";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import Image from "next/image";
import { useAppStore } from "@/app/store";
import moment from "moment";
import { toast } from "react-toastify";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogContent,
} from "./ui/dialog";

export default function AccountSettings() {
  const { user, logoutUser } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [confirmDisplayName, setConfirmDisplayName] = useState("");

  const handleDeleteAccount = async () => {
    if (!user) {
      console.error("No user is currently logged in.");
      return;
    }

    if (confirmDisplayName !== user.displayName) {
      toast.error("Display name doesn't match. Please try again.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/deleteUser`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uid: user.uid }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        logoutUser();
      } else {
        toast.error(data.message);
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
      <CardFooter className="flex justify-center sm:justify-start p-2 sm:w-fit">
        <Button
          className="bg-red-500 hover:bg-red-600"
          onClick={() => setIsDeleteModalOpen(true)}
        >
          Delete Account
        </Button>
      </CardFooter>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="displayName" className="text-right">
                Confirm by typing{" "}
                <span className="font-bold">{user?.displayName}</span>
              </Label>
              <Input
                id="displayName"
                className="col-span-3"
                value={confirmDisplayName}
                onChange={(e) => setConfirmDisplayName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isLoading || confirmDisplayName !== user?.displayName}
            >
              {isLoading ? "Deleting..." : "Delete Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
