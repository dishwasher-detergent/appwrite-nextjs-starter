"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { Dialog, DialogContent } from "@/components/ui/dialog";

export function Modal({
  expectedPath,
  children,
}: {
  expectedPath: string | RegExp;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(true);

  function onDismiss() {
    setOpen(false);
    router.back();
  }

  useEffect(() => {
    console.log(pathname);

    if (expectedPath instanceof RegExp) {
      if (expectedPath.test(pathname)) {
        setOpen(true);

        return;
      }

      setOpen(false);
    } else if (pathname.includes(expectedPath)) {
      setOpen(true);
      return;
    }

    setOpen(false);
  }, [pathname, setOpen]);

  return createPortal(
    <Dialog open={open} onOpenChange={onDismiss}>
      <DialogContent>{children}</DialogContent>
    </Dialog>,
    document.getElementById("modal-root")!
  );
}
