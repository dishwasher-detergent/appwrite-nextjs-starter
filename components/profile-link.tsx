import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AVATAR_BUCKET_ID, ENDPOINT, PROJECT_ID } from "@/lib/constants";
import { cn, getInitials } from "@/lib/utils";

interface ProfileLinkProps {
  avatar?: string | null;
  name?: string;
  href: string;
  className?: string;
}

export function ProfileLink({
  avatar,
  name,
  href,
  className,
}: ProfileLinkProps) {
  return (
    <Button
      variant="link"
      asChild
      className={cn("text-sm text-primary-foreground p-0", className)}
    >
      <Link href={href}>
        <Avatar className="h-6 w-6">
          <AvatarImage
            src={
              avatar
                ? `${ENDPOINT}/storage/buckets/${AVATAR_BUCKET_ID}/files/${avatar}/view?project=${PROJECT_ID}`
                : undefined
            }
            alt={name || "Unknown"}
          />
          <AvatarFallback className="text-primary">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
        {name || "Unknown"}
      </Link>
    </Button>
  );
}
