"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { createWebQueryClient } from "../../lib/query-client";
import { ToastProvider } from "./toast-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => createWebQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>{children}</ToastProvider>
    </QueryClientProvider>
  );
}