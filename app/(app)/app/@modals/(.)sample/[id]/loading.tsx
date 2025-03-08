import { LucideLoader2 } from "lucide-react";

import { Modal } from "../../modal";
import { DialogTitle } from "@/components/ui/dialog";

export default function Loading() {
  return (
    <Modal>
      <DialogTitle className="hidden">Loading</DialogTitle>
      <div className="w-full h-full grid place-items-center p-8">
        <LucideLoader2 className="size-8 animate-spin" />
      </div>
    </Modal>
  );
}
