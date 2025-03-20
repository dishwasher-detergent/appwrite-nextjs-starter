import { Samples } from "@/components/realtime/samples";
import { Sample } from "@/interfaces/sample.interface";

interface UserContentProps {
  samples: Sample[];
  userId: string;
}

export function UserContent({ samples, userId }: UserContentProps) {
  return (
    <div>
      <h3 className="font-semibold text-lg mb-2">Samples</h3>
      <Samples initialSamples={samples} userId={userId} />
    </div>
  );
}
