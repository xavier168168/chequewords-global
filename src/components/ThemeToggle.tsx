"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("theme");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" aria-label="theme">
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  const cycle = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const Icon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;
  const label =
    theme === "dark" ? t("dark") : theme === "light" ? t("light") : t("system");

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={cycle}
      title={label}
      aria-label={label}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}
