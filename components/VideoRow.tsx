// Row of 3 vertical (9:16) video placeholders, matching the format shown
// on yasirov.com's content-creator page. Swap the placeholder tiles for
// real <video> embeds once Anton sends footage.
export function VideoRow() {
  return (
    <div className="grid grid-cols-3 gap-3 md:gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="relative aspect-[9/16] overflow-hidden rounded-2xl bg-foreground/90 md:rounded-3xl"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background/90 md:h-14 md:w-14">
              <div
                className="ml-0.5 h-0 w-0 border-y-[6px] border-l-[10px] border-y-transparent border-l-foreground md:border-y-[8px] md:border-l-[13px]"
                aria-hidden
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
