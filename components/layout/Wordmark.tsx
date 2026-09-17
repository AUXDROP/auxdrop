import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

export function Wordmark({
  href = "/",
  size = "default",
  className,
}: {
  href?: string;
  size?: "default" | "small";
  className?: string;
}) {
  const iconSize = size === "small" ? 20 : 26;
  const textSize = size === "small" ? "text-sm" : "text-lg";

  return (
    <Link href={href} className={cn("flex items-center gap-2.5", className)}>
      <Image
        src="/auxdrop-icon.svg"
        alt=""
        width={iconSize}
        height={iconSize}
        className="invert"
      />
      <span className={cn("font-display font-extrabold text-on-dark", textSize)}>
        AUXDROP
      </span>
    </Link>
  );
}
