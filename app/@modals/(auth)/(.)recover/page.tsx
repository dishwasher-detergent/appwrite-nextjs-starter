import { RecoverForm } from "@/app/(auth)/recover/form";
import { RecoveryFooter } from "@/components/recovery-footer";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Modal } from "../../modal";
import { ModalWrapper } from "../../modal-wrapper";

export default function RecoverPasswordPage() {
  return (
    <ModalWrapper>
      <Modal>
        <DialogHeader>
          <DialogTitle>Password Recovery</DialogTitle>
          <DialogDescription>
            Enter your email address and we&apos;ll send you a password reset
            link.
          </DialogDescription>
        </DialogHeader>
        <RecoverForm />
        <DialogFooter className="flex flex-col items-start">
          <RecoveryFooter />
        </DialogFooter>
      </Modal>
    </ModalWrapper>
  );
}
