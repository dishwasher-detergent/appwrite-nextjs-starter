import { SignInForm } from "@/app/(auth)/signin/form";
import { Modal } from "../../modal";

export default function Page() {
  return (
    <Modal>
      <SignInForm />
    </Modal>
  );
}
