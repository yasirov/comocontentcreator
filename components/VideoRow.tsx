// Row of up to 3 vertical (9:16) reels, matching the format shown on
// yasirov.com's content-creator page. Videos come from the "Home Page"
// document in Sanity (Hero -> Reels) - the local files in /public/videos
// are only the fallback shown before Anton uploads real ones there.
//
// On a phone, three side-by-side reels would be ~110px wide each (nothing
// is readable at that size), so the row becomes a snap-scrolling carousel
// where each reel takes ~72% of the screen. From the sm breakpoint up it
// is the original three-column grid.
export function VideoRow({ videos }: { videos: string[] }) {
  if (!videos?.length) return null;

  return (
    <div className="-mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0 md:gap-4">
      {videos.slice(0, 3).map((src) => (
        <div
          key={src}
          className="relative aspect-[9/16] w-[72%] flex-shrink-0 snap-center overflow-hidden rounded-2xl bg-foreground/10 sm:w-auto md:rounded-3xl"
        >
          <video
            className="h-full w-full object-cover"
            src={src}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
          />
        </div>
      ))}
    </div>
  );
}
