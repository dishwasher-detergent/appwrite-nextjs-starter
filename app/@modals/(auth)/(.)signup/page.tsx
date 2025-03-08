import { SignUpForm } from "@/app/(auth)/signup/form";
import { SignUpFooter } from "@/components/signup-footer";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Modal } from "../../modal";

export default function Page() {
  return (
    <Modal expectedPath={"signup"}>
      <DialogHeader>
        <DialogTitle>Sign Up</DialogTitle>
        <DialogDescription>
          Enter your email below to create your account.
        </DialogDescription>
      </DialogHeader>
      <SignUpForm />
      <DialogFooter className="flex flex-col items-start">
        <SignUpFooter />
      </DialogFooter>
    </Modal>
  );
}
