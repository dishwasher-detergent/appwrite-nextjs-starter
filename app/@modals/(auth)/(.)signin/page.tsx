import { SignInForm } from "@/app/(auth)/signin/form";
import { SignInFooter } from "@/components/signin-footer";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Modal } from "../../modal";

export default function Page() {
  return (
    <Modal expectedPath={"signin"}>
      <DialogHeader>
        <DialogTitle>Sign In</DialogTitle>
        <DialogDescription>
          Enter your email below to sign in to your account.
        </DialogDescription>
      </DialogHeader>
      <SignInForm />
      <DialogFooter className="flex flex-col items-start">
        <SignInFooter />
      </DialogFooter>
    </Modal>
  );
}
