import type { Metadata } from "next";
import { Karla } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NextJS with Appwrite",
  description: "A NextJS starter with Appwrite, TypeScript, and TailwindCSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${karla.variable} min-h-dvh overflow-x-hidden antialiased flex flex-col`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
