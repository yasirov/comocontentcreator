"use client";

// Row of up to 3 vertical (9:16) reels, matching the format shown on
// yasirov.com's content-creator page. Videos come from the "Home Page"
// document in Sanity (Hero -> Reels) - the local files in /public/videos
// are only the fallback shown before Anton uploads real ones there.
//
// On a phone the reels stack one under another (a 9:16 clip squeezed into
// a third of a 390px screen is unwatchable), capped at 70% of the viewport
// height so a single reel never fills the whole screen. From the sm
// breakpoint up it is the original three-column row.
//
// Loading strategy, and why it matters: three autoplaying reels used to
// start downloading at once on page load. On a throttled 4G phone they
// saturated the connection and pushed LCP to 3.4s even though the visible
// element - the first poster - is under 70 KB. Now every clip ships with
// preload="none" and only starts loading (and playing) once it is close to
// the viewport, so the posters paint immediately and the bytes follow.

import { useEffect, useRef } from "react";

// A first frame to show while the clip downloads. The three fallback reels
// in /public/videos each ship with a matching .webp; a Sanity-hosted video
// has no such file, and a poster that 404s is ignored silently by the
// browser, so deriving the path is safe either way.
function posterFor(src: string) {
  return src.replace(/\.(mp4|mov|m4v)(\?.*)?$/i, ".webp");
}

export function VideoRow({ videos }: { videos: string[] }) {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const clips = Array.from(row.querySelectorAll("video"));
    const start = (v: HTMLVideoElement) => {
      if (v.preload !== "auto") v.preload = "auto";
      void v.play().catch(() => {});
    };

    if (typeof IntersectionObserver === "undefined") {
      clips.forEach(start);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const clip = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) start(clip);
          else clip.pause();
        }
      },
      // Begin a little before the clip scrolls in, so it is already playing
      // by the time it is actually on screen.
      { rootMargin: "300px 0px", threshold: 0.2 },
    );

    clips.forEach((clip) => io.observe(clip));
    return () => io.disconnect();
  }, [videos]);

  if (!videos?.length) return null;
  const shown = videos.slice(0, 3);

  return (
    <>
      {/* The first poster is the largest element in the hero, so it is also
          the LCP candidate. Preloading it lets the browser fetch it before
          React hydrates. */}
      <link
        rel="preload"
        as="image"
        href={posterFor(shown[0])}
        fetchPriority="high"
      />
      <div
        ref={rowRef}
        className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-3 md:gap-4"
      >
        {shown.map((src) => (
          <div
            key={src}
            className="relative mx-auto aspect-[9/16] max-h-[70vh] w-full overflow-hidden rounded-2xl bg-foreground/10 sm:mx-0 sm:max-h-none md:rounded-3xl"
          >
            {/* Without a poster the reels are three empty grey boxes until
                the clips arrive. */}
            <video
              className="h-full w-full object-cover"
              src={src}
              poster={posterFor(src)}
              muted
              loop
              playsInline
              preload="none"
              aria-hidden
            />
          </div>
        ))}
      </div>
    </>
  );
}
