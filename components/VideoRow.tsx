// Row of 3 vertical (9:16) reels, matching the format shown on
// yasirov.com's content-creator page. Files live in /public/videos -
// swap them for new footage by replacing reel-1/2/3.mp4 + .jpg.
const reels = [
  { src: "/videos/reel-1.mp4", poster: "/videos/reel-1.jpg" },
  { src: "/videos/reel-2.mp4", poster: "/videos/reel-2.jpg" },
  { src: "/videos/reel-3.mp4", poster: "/videos/reel-3.jpg" },
];

export function VideoRow() {
  return (
    <div className="grid grid-cols-3 gap-3 md:gap-4">
      {reels.map((reel) => (
        <div
          key={reel.src}
          className="relative aspect-[9/16] overflow-hidden rounded-2xl bg-foreground/90 md:rounded-3xl"
        >
          <video
            className="h-full w-full object-cover"
            src={reel.src}
            poster={reel.poster}
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
