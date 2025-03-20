"use client";

import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export function DyanmicPopover({
  button,
  children,
  setOpen,
  open,
}: {
  button: string | React.ReactNode;
  children: React.ReactNode;
  setOpen: (e: boolean) => void;
  open: boolean;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{button}</PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          {children}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{button}</DrawerTrigger>
      <DrawerContent className="max-h-[80dvh]">
        <DrawerTitle className="sr-only">Team Select</DrawerTitle>
        <div className="mt-4">{children}</div>
      </DrawerContent>
    </Drawer>
  );
}
