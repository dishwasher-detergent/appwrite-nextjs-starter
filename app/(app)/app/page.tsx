import { Button } from "@/components/ui/button";
import { getSamples } from "@/lib/db/queries";

export default async function AppPage() {
  const data = await getSamples();

  console.log(data);

  return (
    <div>
      <header className="flex flex-row justify-between items-center">
        <h2>Samples</h2>
        <Button size="sm">Add Sample</Button>
      </header>
      <ul>
        {data.data?.documents.map((sample) => (
          <li key={sample.$id} className="border-b border-gray-200 py-2">
            <p className="font-semibold">{sample.name}</p>
            <p className="text-sm">{sample.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
