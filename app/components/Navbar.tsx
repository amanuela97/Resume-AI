"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/app/store";
import {
  FileChartColumn,
  Files,
  FileArchive,
  LogOut,
  LayoutTemplate,
  Hammer,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { useState } from "react";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { user, logoutUser } = useAppStore();

  const handleLogout = () => {
    logoutUser();
    router.push("/");
  };

  return (
    <nav className="bg-background text-primary-foreground p-4 shadow-md mb-2">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <FileChartColumn className="h-6 w-6" />
          <Link href="/" className="text-2xl font-bold">
            Resume AI
          </Link>
        </div>
        {user && (
          <div className="relative">
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none">
                  <Image
                    src={user.photoURL || "/placeholder.svg"}
                    alt="User avatar"
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-card">
                <DropdownMenuItem
                  className="cursor-pointer my-2 hover:bg-background"
                  onClick={() => router.push("/build")}
                >
                  <Hammer className="mr-2 h-4 w-4" />
                  <span>Create a Resume</span>
                </DropdownMenuItem>
                {user.role === "admin" && (
                  <DropdownMenuItem
                    className="cursor-pointer my-2 hover:bg-background"
                    onClick={() => router.push("/template")}
                  >
                    <LayoutTemplate className="mr-2 h-4 w-4" />
                    <span>Add a Template</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  className="cursor-pointer my-2 hover:bg-background"
                  onClick={() => router.push("/cover-letter")}
                >
                  <FileArchive className="mr-2 h-4 w-4" />
                  <span>Cover letters</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer my-2 hover:bg-background"
                  onClick={() => router.push("/analyses")}
                >
                  <Files className="mr-2 h-4 w-4" />
                  <span>Analyses</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer my-2 hover:bg-background text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </nav>
  );
}
