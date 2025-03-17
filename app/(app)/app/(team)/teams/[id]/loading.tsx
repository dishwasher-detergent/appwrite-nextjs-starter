import { LucideLoader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full h-full grid place-items-center">
      <LucideLoader2 className="size-8 animate-spin" />
    </div>
  );
}
