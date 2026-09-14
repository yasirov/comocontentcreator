import { buildLlmsTxt } from "@/lib/llms";

// The long form of llms.txt: the same file plus the full text of every
// Journal article, for assistants that fetch one document instead of
// crawling the site.
export const revalidate = 60;

export async function GET() {
  return new Response(await buildLlmsTxt({ full: true }), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
