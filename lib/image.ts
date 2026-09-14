// Image framing helpers, kept in their own module (no Sanity client import)
// so client components can use them without pulling the server-side data
// layer into the browser bundle.

// A point (0-1, 0-1) inside an image, dragged onto the subject in Sanity
// Studio, marking what has to stay in frame when the image is cropped.
// Applied in the browser as a CSS object-position rather than baked into
// the file, so one upload works as a round avatar, a tall portrait and a
// wide cover without three different crops.
export type Hotspot = { x: number; y: number };

export function focalPosition(hotspot?: Hotspot): string {
  if (!hotspot) return "center";
  return `${Math.round(hotspot.x * 100)}% ${Math.round(hotspot.y * 100)}%`;
}
