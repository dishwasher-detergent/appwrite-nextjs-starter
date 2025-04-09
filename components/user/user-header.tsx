import { Header } from "@/components/ui/header";
import { UserActions } from "@/components/user/user-actions";
import { UserData } from "@/interfaces/user.interface";
import { AVATAR_BUCKET_ID, ENDPOINT, PROJECT_ID } from "@/lib/constants";

interface UserHeaderProps {
  user: UserData;
  canEdit: boolean;
}

export function UserHeader({ user, canEdit }: UserHeaderProps) {
  return (
    <Header
      src={
        user.avatar
          ? `${ENDPOINT}/storage/buckets/${AVATAR_BUCKET_ID}/files/${user.avatar}/view?project=${PROJECT_ID}`
          : undefined
      }
      alt={`${user.name}'s picture`}
    >
      {canEdit && <UserActions user={user} />}
    </Header>
  );
}
