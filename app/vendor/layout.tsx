"use client";
import { useAuth } from "@/components/context/auth_provider";
import React from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

const Layout = (props: Props) => {
  const { loggedIn, loading, user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loggedIn && !loading) {
      router.push("/auth/vendor/signin");
      return;
    }
  }, [loggedIn, loading, router]);
  return <div>{props.children}</div>;
};

export default Layout;
