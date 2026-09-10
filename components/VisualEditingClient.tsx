"use client";

import { VisualEditing } from "@sanity/visual-editing/react";
import { useRouter } from "next/navigation";

// Renders only while Draft Mode is on (see app/layout.tsx). Draws the
// click-to-edit overlay Sanity's "Presentation" tool uses, and refreshes
// the page's server-rendered data whenever a field changes in the Studio.
export function VisualEditingClient() {
  const router = useRouter();
  return (
    <VisualEditing
      portal
      refresh={async () => {
        router.refresh();
      }}
    />
  );
}
