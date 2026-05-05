"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (
      process.env.NODE_ENV === "production" &&
      typeof navigator !== "undefined" &&
      "serviceWorker" in navigator
    ) {
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
      void navigator.serviceWorker.register(`${basePath}/sw.js`);
    }
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
      <Toaster richColors position="top-center" />
    </ThemeProvider>
  );
}
