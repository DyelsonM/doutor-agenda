"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="size-11">
        <Sun className="size-5" />
        <span className="sr-only">Alternar tema</span>
      </Button>
    );
  }

  const displayTheme = theme === "system" ? "system" : resolvedTheme || "light";

  const handleThemeChange = (newTheme: string) => {
    setIsRotating(true);
    setTheme(newTheme);
    setTimeout(() => setIsRotating(false), 300);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="group relative size-11 overflow-hidden rounded-md transition-all duration-300 hover:scale-110 hover:bg-accent/80 active:scale-95"
        >
          <div className="relative size-full">
            <Sun
              className={`absolute inset-0 m-auto size-5 transition-all duration-500 ${
                displayTheme === "dark"
                  ? "rotate-90 scale-0 opacity-0"
                  : "rotate-0 scale-100 opacity-100"
              } ${isRotating ? "animate-spin" : ""} ${
                displayTheme === "light"
                  ? "text-yellow-500 dark:text-yellow-400"
                  : "text-muted-foreground"
              }`}
            />
            <Moon
              className={`absolute inset-0 m-auto size-5 transition-all duration-500 ${
                displayTheme === "dark"
                  ? "rotate-0 scale-100 opacity-100"
                  : "-rotate-90 scale-0 opacity-0"
              } ${isRotating ? "animate-spin" : ""} ${
                displayTheme === "dark"
                  ? "text-blue-400 dark:text-blue-300"
                  : "text-muted-foreground"
              }`}
            />
            {displayTheme === "system" && (
              <Monitor
                className={`absolute inset-0 m-auto size-5 transition-all duration-500 ${
                  isRotating ? "animate-pulse" : ""
                } text-muted-foreground`}
              />
            )}
          </div>
          <span className="sr-only">Alternar tema</span>
          <span className="absolute inset-0 rounded-md bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 opacity-0 transition-opacity duration-300 group-hover:from-primary/10 group-hover:via-primary/5 group-hover:to-primary/10 group-hover:opacity-100" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuRadioGroup value={theme} onValueChange={handleThemeChange}>
          <DropdownMenuRadioItem
            value="light"
            className="cursor-pointer transition-colors hover:bg-accent/80"
          >
            <Sun
              className={`mr-2 size-5 transition-colors ${
                theme === "light"
                  ? "text-yellow-500 dark:text-yellow-400"
                  : "text-muted-foreground"
              }`}
            />
            <span className="font-medium">Claro</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="dark"
            className="cursor-pointer transition-colors hover:bg-accent/80"
          >
            <Moon
              className={`mr-2 size-5 transition-colors ${
                theme === "dark"
                  ? "text-blue-400 dark:text-blue-300"
                  : "text-muted-foreground"
              }`}
            />
            <span className="font-medium">Escuro</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="system"
            className="cursor-pointer transition-colors hover:bg-accent/80"
          >
            <Monitor
              className={`mr-2 size-5 transition-colors ${
                theme === "system"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            />
            <span className="font-medium">Sistema</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

