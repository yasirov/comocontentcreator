import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

type PillButtonProps = ComponentPropsWithoutRef<typeof Link> & {
  variant?: "solid" | "outline";
};

export function PillButton({
  variant = "solid",
  className = "",
  children,
  ...props
}: PillButtonProps) {
  const base = "pill-button px-5 py-2.5 text-sm";
  const styles =
    variant === "outline"
      ? "border border-foreground/15 !bg-transparent !text-foreground"
      : "";

  return (
    <Link className={`${base} ${styles} ${className}`} {...props}>
      {children}
      <span className="pill-dot" aria-hidden />
    </Link>
  );
}
