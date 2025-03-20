import Image from "next/image";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { UserActions } from "@/components/user/user-actions";
import { UserData } from "@/interfaces/user.interface";
import { AVATAR_BUCKET_ID, ENDPOINT, PROJECT_ID } from "@/lib/constants";

interface UserHeaderProps {
  user: UserData;
  canEdit: boolean;
}

export function UserHeader({ user, canEdit }: UserHeaderProps) {
  return (
    <header className="relative">
      <div
        role="img"
        aria-label="Team banner"
        className="w-full bg-linear-to-r from-primary to-secondary rounded-xl h-48"
      />
      <div className="flex items-start justify-between px-4 -mt-30">
        <figure className="relative flex-shrink-0 size-60">
          <AspectRatio ratio={1}>
            {user?.avatar ? (
              <Image
                src={`${ENDPOINT}/storage/buckets/${AVATAR_BUCKET_ID}/files/${user.avatar}/view?project=${PROJECT_ID}`}
                alt={`${user.name}'s picture`}
                className="rounded-full border-4 border-background object-cover bg-primary size-full"
                fill
                priority
              />
            ) : (
              <div
                aria-label="Default picture"
                className="rounded-full border-4 border-background object-cover bg-primary size-full text-primary-foreground grid place-items-center font-bold"
              >
                No Image
              </div>
            )}
          </AspectRatio>
        </figure>
        <div className="pt-32 flex flex-row gap-1">
          {canEdit && <UserActions user={user} />}
        </div>
      </div>
    </header>
  );
}
