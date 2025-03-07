import React, { Suspense } from "react";

export default async function Layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <Suspense fallback={null}>
        {children}
      </Suspense>
    );
  }
  