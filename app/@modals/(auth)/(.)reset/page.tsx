import { Suspense } from "react";

import { ResetForm } from "@/app/(auth)/reset/form";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Modal } from "../../modal";

export default function ResetPasswordPage() {
  return (
    <Modal>
      <DialogHeader>
        <DialogTitle>Set New Password</DialogTitle>
        <DialogDescription>
          Please enter your new password below.
        </DialogDescription>
      </DialogHeader>
      <Suspense fallback={null}>
        <ResetForm />
      </Suspense>
    </Modal>
  );
}
