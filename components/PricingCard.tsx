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
    // flex column + mt-auto on the price: with 3-4 cards side by side the
    // feature lists are rarely the same length, and this keeps every price
    // pill on the same line instead of floating mid-card.
    // No h-full here: grid already stretches cards to equal height, and a
    // percentage height on top of that overflows the row and eats the gap
    // between rows when the cards wrap onto a second line.
    <div className="flex flex-col rounded-3xl border border-border bg-background p-6 sm:p-7">
      <p className="font-semibold">{name}</p>
      <p className="mt-1 text-sm text-muted">{tagline}</p>
      <ul className="mt-6 flex-1 space-y-3 text-sm">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-foreground">
              <svg
                viewBox="0 0 12 12"
                className="h-2.5 w-2.5"
                fill="none"
                aria-hidden
              >
                <path
                  d="M2.5 6.2l2.2 2.2 4.8-5"
                  stroke="var(--background)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <div className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-surface px-4 py-3 text-sm font-medium">
        {price}
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      </div>
    </div>
  );
}
