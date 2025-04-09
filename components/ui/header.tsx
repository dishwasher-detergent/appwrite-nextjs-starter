import Image from "next/image";

import { AspectRatio } from "@/components/ui/aspect-ratio";

interface HeaderProps {
  src?: string;
  alt?: string;
  children?: React.ReactNode;
}

export function Header({ children, src, alt }: HeaderProps) {
  return (
    <header className="relative">
      <div
        role="img"
        aria-label="Banner"
        className="w-full bg-linear-to-r from-primary to-secondary rounded-xl h-24 md:h-48"
      />
      <div className="flex items-start justify-between px-4 -mt-15 md:-mt-30">
        <figure className="relative flex-shrink-0 size-24 md:size-60">
          <AspectRatio ratio={1}>
            {src ? (
              <Image
                src={src}
                alt={alt ?? "Picture"}
                className="rounded-full border-4 border-background object-cover bg-primary size-full"
                fill
                priority
              />
            ) : (
              <div
                aria-label="Default picture"
                className="rounded-full border-4 border-background object-cover bg-primary size-full text-primary-foreground grid place-items-center font-bold"
              >
                No Image
              </div>
            )}
          </AspectRatio>
        </figure>
        <div className="pt-16 md:pt-32 flex flex-row gap-1">{children}</div>
      </div>
    </header>
  );
}
