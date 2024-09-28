"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/app/store";
import Loader from "./Loader";

interface AdminRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: AdminRouteProps) => {
  const router = useRouter();
  const { user, hasHydrated } = useAppStore();
  const isAdmin = useRef(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hasHydrated) {
      isAdmin.current = user?.role === "admin";
      if (!isAdmin.current) {
        router.push("/"); // Redirect to root if user is not logged in
      } else {
        setLoading(false); // User is logged in, stop loading
      }
    }
  }, [isAdmin, hasHydrated]);

  if (loading || !hasHydrated) {
    return <Loader />;
  }

  return <>{isAdmin.current ? children : null}</>; // Render children only if user is logged in
};

export default ProtectedRoute;
