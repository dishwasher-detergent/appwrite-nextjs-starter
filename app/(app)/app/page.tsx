import { AddSample } from "@/components/create-sample";
import { DeleteSample } from "@/components/delete-sample";
import { EditSample } from "@/components/edit-sample";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getSamples } from "@/lib/db";

import { LucideLink2 } from "lucide-react";
import Link from "next/link";

export default async function AppPage() {
  const { data } = await getSamples();

  return (
    <>
      <header className="flex flex-row justify-between items-center pb-4">
        <h2 className="font-bold">Samples</h2>
        <AddSample />
      </header>
      <Table>
        <TableCaption>A list of your recent samples.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="w-full">Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.documents.map((sample) => (
            <TableRow key={sample.$id}>
              <TableCell>
                <Button asChild variant="link" className="p-0!">
                  <Link href={`/app/${sample.$id}`}>
                    {sample.name}
                    <LucideLink2 />
                  </Link>
                </Button>
              </TableCell>
              <TableCell className="w-full">{sample.description}</TableCell>
              <TableCell className="inline-flex gap-2 justify-end">
                <EditSample sample={sample} />
                <DeleteSample sample={sample} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
