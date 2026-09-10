// Row of up to 3 vertical (9:16) reels, matching the format shown on
// yasirov.com's content-creator page. Videos come from the "Home Page"
// document in Sanity (Hero -> Reels) - the local files in /public/videos
// are only the fallback shown before Anton uploads real ones there.
export function VideoRow({ videos }: { videos: string[] }) {
  return (
    <div className="grid grid-cols-3 gap-3 md:gap-4">
      {videos.slice(0, 3).map((src) => (
        <div
          key={src}
          className="relative aspect-[9/16] overflow-hidden rounded-2xl bg-foreground/90 md:rounded-3xl"
        >
          <video
            className="h-full w-full object-cover"
            src={src}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
          />
        </div>
      ))}
    </div>
  );
}
