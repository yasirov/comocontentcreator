// Row of up to 3 vertical (9:16) reels, matching the format shown on
// yasirov.com's content-creator page. Videos come from the "Home Page"
// document in Sanity (Hero -> Reels) - the local files in /public/videos
// are only the fallback shown before Anton uploads real ones there.
//
// On a phone the reels stack one under another (a 9:16 clip squeezed into
// a third of a 390px screen is unwatchable), capped at 70% of the viewport
// height so a single reel never fills the whole screen. From the sm
// breakpoint up it is the original three-column row.
// A first frame to show while the clip downloads. The three fallback reels
// in /public/videos each ship with a matching .jpg; a Sanity-hosted video
// has no such file, and a poster that 404s is ignored silently by the
// browser, so deriving the path is safe either way.
function posterFor(src: string) {
  return src.replace(/\.(mp4|mov|m4v)(\?.*)?$/i, ".jpg");
}

export function VideoRow({ videos }: { videos: string[] }) {
  if (!videos?.length) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-3 md:gap-4">
      {videos.slice(0, 3).map((src) => (
        <div
          key={src}
          className="relative mx-auto aspect-[9/16] max-h-[70vh] w-full overflow-hidden rounded-2xl bg-foreground/10 sm:mx-0 sm:max-h-none md:rounded-3xl"
        >
          {/* Without a poster the three reels are ~15 MB of download and the
              hero sits as three empty grey boxes until they arrive. */}
          <video
            className="h-full w-full object-cover"
            src={src}
            poster={posterFor(src)}
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
