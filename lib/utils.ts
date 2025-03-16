import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Gets initials from a name string
 * @param name Full name string
 * @param maxLength Maximum number of initials to return (default: 2)
 * @returns Uppercase initials string
 */
export function getInitials(name?: string, maxLength: number = 2): string {
  if (!name) return "";

  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, maxLength)
    .join("")
    .toUpperCase();
}
