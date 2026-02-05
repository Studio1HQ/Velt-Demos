"use client";

import { VeltProvider } from "@veltdev/react";
import { ReactNode, Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { MOCK_USERS } from "../data/data";

interface VeltProviderWrapperProps {
  children: ReactNode;
}

function getUserIndexFromUrl(): number {
  if (typeof window === "undefined") return 0;
  const params = new URLSearchParams(window.location.search);
  const userParam = params.get("user");
  return userParam
    ? Math.min(Math.max(0, parseInt(userParam, 10)), MOCK_USERS.length - 1)
    : 0;
}

function VeltProviderInner({ children }: VeltProviderWrapperProps) {
  const searchParams = useSearchParams();
  const [userIndex, setUserIndex] = useState(() => getUserIndexFromUrl());

  // Listen for popstate events (triggered by user switching)
  useEffect(() => {
    const handlePopState = () => {
      setUserIndex(getUserIndexFromUrl());
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Also update when search params change
  useEffect(() => {
    const userParam = searchParams.get("user");
    const newIndex = userParam
      ? Math.min(Math.max(0, parseInt(userParam, 10)), MOCK_USERS.length - 1)
      : 0;
    setUserIndex(newIndex);
  }, [searchParams]);

  const currentUser = MOCK_USERS[userIndex];

  return (
    <VeltProvider
      apiKey={process.env.NEXT_PUBLIC_VELT_API_KEY || "YOUR_VELT_API_KEY"}
      authProvider={{
        user: currentUser,
        retryConfig: {
          retryCount: 3,
          retryDelay: 1000,
        },
      }}
    >
      {children}
    </VeltProvider>
  );
}

export function VeltProviderWrapper({ children }: VeltProviderWrapperProps) {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-[#f5f5f5] dark:bg-[#1a1a1a]" />}
    >
      <VeltProviderInner>{children}</VeltProviderInner>
    </Suspense>
  );
}
