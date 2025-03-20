import { UserData } from "@/interfaces/user.interface";

interface UserDescriptionProps {
  user: UserData;
}

export function UserDescription({ user }: UserDescriptionProps) {
  return (
    <div className="max-w-prose">
      <h1 className="text-2xl font-bold tracking-tight mb-1">{user.name}</h1>
      <section aria-label="About">
        <p className="text-muted-foreground leading-relaxed">
          {user.about ?? "No description provided."}
        </p>
      </section>
    </div>
  );
}
