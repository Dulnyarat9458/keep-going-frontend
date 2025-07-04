"use client";
import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { anonymousPath } from "@/constants/anonymousPath";

export function useRedirectIfAuthenticated(userInfo: { email?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const prevEmail = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (
      userInfo &&
      typeof userInfo.email === 'string' &&
      userInfo.email.length > 0 &&
      anonymousPath.includes(pathname) &&
      pathname !== '/' &&
      prevEmail.current !== userInfo.email
    ) {
      prevEmail.current = userInfo.email;
      router.push('/');
    } else {
      prevEmail.current = userInfo?.email;
    }
  }, [userInfo, pathname, router]);
}
