import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserData } from "@/interfaces/user.interface";
import { AVATAR_BUCKET_ID, ENDPOINT, PROJECT_ID } from "@/lib/constants";
import { getInitials } from "@/lib/utils";

interface AvatarGroupProps<T extends UserData> {
  users?: T[];
}

export function AvatarGroup<T extends UserData>({
  users,
}: AvatarGroupProps<T>) {
  return (
    <ul className="flex flex-wrap gap-2 -space-x-6 hover:-space-x-2">
      {users?.map((user) => (
        <li key={user.$id}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Avatar className="size-10 border-2 border-background">
                  <AvatarImage
                    src={
                      user.avatar
                        ? `${ENDPOINT}/storage/buckets/${AVATAR_BUCKET_ID}/files/${user.avatar}/view?project=${PROJECT_ID}`
                        : undefined
                    }
                    alt={user.name || "User"}
                  />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>{user.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </li>
      ))}
    </ul>
  );
}
