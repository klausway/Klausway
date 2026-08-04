import { permanentRedirect } from "next/navigation";
import { routes } from "@/lib/navigation";

type BlogSlugRedirectProps = {
  params: Promise<{ slug: string }>;
};

/** Legacy /blog/[slug] → /resources/[slug] */
export default async function BlogSlugRedirect({
  params,
}: BlogSlugRedirectProps) {
  const { slug } = await params;
  permanentRedirect(`${routes.resources}/${slug}`);
}
