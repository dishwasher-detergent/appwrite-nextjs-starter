import { LucideLoader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-dvw h-dvh grid place-items-center">
      <LucideLoader2 className="size-8 animate-spin" />
    </div>
  );
}
