"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { Dialog, DialogContent } from "@/components/ui/dialog";

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  function onDismiss() {
    setOpen(false);
    router.back();
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <Dialog open={open} onOpenChange={onDismiss}>
      <DialogContent>{children}</DialogContent>
    </Dialog>,
    document.getElementById("modal-root")!
  );
}
