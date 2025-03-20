import { TeamData } from "@/interfaces/team.interface";

interface TeamDescriptionProps {
  team: TeamData;
}

export function TeamDescription({ team }: TeamDescriptionProps) {
  return (
    <div className="max-w-prose">
      <h1 className="text-2xl font-bold tracking-tight mb-1">{team.name}</h1>
      <section aria-label="About">
        <p className="text-muted-foreground leading-relaxed">
          {team.about ?? "No description provided."}
        </p>
      </section>
    </div>
  );
}
