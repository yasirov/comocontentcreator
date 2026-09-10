import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

// Hit by Sanity Studio's "Presentation" tool when Anton opens the live
// preview - turns on Next.js Draft Mode so the site renders unpublished
// edits instead of the published version.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const redirectTo = searchParams.get("redirect") || "/";

  (await draftMode()).enable();

  redirect(redirectTo);
}
