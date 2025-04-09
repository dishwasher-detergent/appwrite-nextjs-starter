import { TeamActions } from "@/components/team/team-actions";
import { Header } from "@/components/ui/header";
import { TeamData } from "@/interfaces/team.interface";
import { AVATAR_BUCKET_ID, ENDPOINT, PROJECT_ID } from "@/lib/constants";

interface TeamHeaderProps {
  team: TeamData;
  isOwner: boolean;
  isAdmin: boolean;
  isMember: boolean;
}

export function TeamHeader({
  team,
  isOwner,
  isAdmin,
  isMember,
}: TeamHeaderProps) {
  return (
    <Header
      src={
        team.avatar
          ? `${ENDPOINT}/storage/buckets/${AVATAR_BUCKET_ID}/files/${team.avatar}/view?project=${PROJECT_ID}`
          : undefined
      }
      alt={`${team.name}'s picture`}
    >
      {isMember && (
        <TeamActions team={team} isOwner={isOwner} isAdmin={isAdmin} />
      )}
    </Header>
  );
}
