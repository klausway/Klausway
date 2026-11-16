import { revalidatePath } from "next/cache";
import { routes } from "@/lib/navigation";

/** Refresh resource pages, sitemap, and RSS after a CMS write so publishes show up immediately. */
export function revalidateResources(...slugs: (string | null | undefined)[]) {
  revalidatePath("/sitemap.xml");
  revalidatePath("/feed.xml");
  revalidatePath(routes.resources);
  for (const slug of new Set(slugs.filter(Boolean))) {
    revalidatePath(`${routes.resources}/${slug}`);
  }
}
