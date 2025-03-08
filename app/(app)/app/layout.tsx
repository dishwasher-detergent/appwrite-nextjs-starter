import { Nav } from "@/components/ui/nav";

export default async function AppLayout({
  children,
  modals,
}: Readonly<{
  children: React.ReactNode;
  modals: React.ReactNode;
}>) {
  return (
    <>
      <main className="flex w-full grow flex-col">
        <Nav />
        <section className="mx-auto max-w-6xl w-full p-4 md:px-8">
          {children}
          {modals}
        </section>
      </main>
      <div id="modal-root" />
    </>
  );
}
