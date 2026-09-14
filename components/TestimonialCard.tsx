import Image from "next/image";
import { focalPosition, type Hotspot } from "@/lib/image";

export function TestimonialCard({
  quote,
  name,
  role,
  avatar,
  avatarHotspot,
}: {
  quote: string;
  name: string;
  role?: string;
  avatar?: string;
  avatarHotspot?: Hotspot;
}) {
  return (
    <div className="rounded-3xl bg-surface p-6">
      <p className="text-sm leading-relaxed">&ldquo;{quote}&rdquo;</p>
      <div className="mt-5 flex items-center gap-3">
        {avatar ? (
          <Image
            src={avatar}
            alt={name}
            width={36}
            height={36}
            className="h-9 w-9 flex-shrink-0 rounded-full object-cover"
            style={{ objectPosition: focalPosition(avatarHotspot) }}
          />
        ) : (
          <div className="h-9 w-9 flex-shrink-0 rounded-full bg-border" aria-hidden />
        )}
        <div>
          <p className="text-sm font-medium">{name}</p>
          {role && <p className="text-xs text-muted">{role}</p>}
        </div>
      </div>
    </div>
  );
}
