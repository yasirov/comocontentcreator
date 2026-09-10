export function PricingCard({
  name,
  tagline,
  price,
  features,
}: {
  name: string;
  tagline: string;
  price: string;
  features: string[];
}) {
  return (
    <div className="rounded-3xl border border-border bg-surface p-6">
      <p className="font-semibold">{name}</p>
      <p className="mt-1 text-sm text-muted">{tagline}</p>
      <ul className="mt-5 space-y-2.5 text-sm">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex items-center gap-2 rounded-full bg-background px-4 py-2.5 text-sm font-medium w-fit">
        {price}
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      </div>
    </div>
  );
}
