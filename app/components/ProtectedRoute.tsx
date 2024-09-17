"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/app/store";
import Loader from "./Loader";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();
  const { user } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storageData = localStorage.getItem("user");
    if (!user && !storageData) {
      router.push("/"); // Redirect to root if user is not logged in
    } else {
      setLoading(false); // User is logged in, stop loading
    }
  }, [user, router]);

  if (loading) {
    return <Loader />;
  }

  return <>{user ? children : null}</>; // Render children only if user is logged in
};

export default ProtectedRoute;
