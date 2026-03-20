import Image from "next/image";

import { cn } from "@/lib/utils";

interface IconProps {
  src: string;
  alt?: string;
  className?: string;
}

export function Icon({ src, alt = "", className }: IconProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={24}
      height={24}
      className={cn("size-4", className)}
      aria-hidden={!alt}
    />
  );
}
