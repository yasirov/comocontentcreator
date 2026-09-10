export function TestimonialCard({
  quote,
  name,
  role,
}: {
  quote: string;
  name: string;
  role?: string;
}) {
  return (
    <div className="rounded-3xl bg-surface p-6">
      <p className="text-sm leading-relaxed">&ldquo;{quote}&rdquo;</p>
      <div className="mt-5 flex items-center gap-3">
        <div className="h-9 w-9 flex-shrink-0 rounded-full bg-border" aria-hidden />
        <div>
          <p className="text-sm font-medium">{name}</p>
          {role && <p className="text-xs text-muted">{role}</p>}
        </div>
      </div>
    </div>
  );
}
