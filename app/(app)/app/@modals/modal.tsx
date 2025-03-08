"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

import { Dialog, DialogContent } from "@/components/ui/dialog";

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  function onDismiss() {
    setOpen(false);
    router.back();
  }

  return createPortal(
    <Dialog open={open} onOpenChange={onDismiss}>
      <DialogContent className="p-0">{children}</DialogContent>
    </Dialog>,
    document.getElementById("modal-root")!
  );
}
