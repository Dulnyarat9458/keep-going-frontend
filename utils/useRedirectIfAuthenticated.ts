"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { anonymousPath } from "@/constants/anonymousPath";

export function useRedirectIfAuthenticated(userInfo: { email?: string }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (userInfo && userInfo.email && anonymousPath.includes(pathname)) {
      router.push("/");
    }
  }, [userInfo, pathname, router]);
}
