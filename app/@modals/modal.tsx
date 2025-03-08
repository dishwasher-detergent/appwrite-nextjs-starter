"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createPortal } from "react-dom";

import { Dialog, DialogContent } from "@/components/ui/dialog";

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  if (typeof window === "undefined") {
    return null;
  }

  function onDismiss() {
    setOpen(false);
    router.back();
  }

  return createPortal(
    <Dialog open={open} onOpenChange={onDismiss}>
      <DialogContent>{children}</DialogContent>
    </Dialog>,
    document.getElementById("modal-root")!
  );
}
