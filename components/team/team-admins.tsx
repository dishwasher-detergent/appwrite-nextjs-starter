import { AvatarGroup } from "@/components/ui/avatar-group";
import { ADMIN_ROLE } from "@/constants/team.constants";
import { UserMemberData } from "@/interfaces/user.interface";

interface TeamAdminsProps {
  members: UserMemberData[];
}

export function TeamAdmins({ members }: TeamAdminsProps) {
  const adminMembers = members?.filter((user) =>
    user.roles.includes(ADMIN_ROLE)
  );

  return (
    <section>
      <h2 className="font-semibold text-lg mb-2">Admins</h2>
      <AvatarGroup users={adminMembers} />
    </section>
  );
}
