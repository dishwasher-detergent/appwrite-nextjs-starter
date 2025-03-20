import { Samples } from "@/components/realtime/samples";
import { Sample } from "@/interfaces/sample.interface";

interface TeamContentProps {
  samples: Sample[];
  teamId: string;
}

export function TeamContent({ samples, teamId }: TeamContentProps) {
  return (
    <div>
      <h3 className="font-semibold text-lg mb-2">Samples</h3>
      <Samples initialSamples={samples} teamId={teamId} />
    </div>
  );
}
