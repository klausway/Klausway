import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { ContentDetailMedia } from "@/components/content-detail-media";
import {
  ContentDetailArticle,
  ContentDetailMeta,
  ContentDetailShell,
} from "@/components/content-detail-shell";
import { RichTextContent } from "@/components/rich-text-content";
import { CtaSection } from "@/components/cta-section";
import { JsonLd } from "@/components/json-ld";
import { resourceTypeLabels } from "@/lib/blog";
import { getResourcePost } from "@/lib/blog-data";
import { routes } from "@/lib/navigation";
import {
  blogPostingJsonLd,
  breadcrumbJsonLd,
  buildPageMetadata,
} from "@/lib/seo";

type ResourcePostPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: ResourcePostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getResourcePost(slug);
  if (!post) return { title: "Resource Not Found", robots: { index: false } };
  return buildPageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `${routes.resources}/${post.slug}`,
    image: post.coverImage,
    type: "article",
    publishedTime: post.date,
  });
}

export default async function ResourcePostPage({
  params,
}: ResourcePostPageProps) {
  const { slug } = await params;
  const post = await getResourcePost(slug);
  if (!post) notFound();

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: routes.home },
            { name: "Resources", path: routes.resources },
            { name: post.title, path: `${routes.resources}/${post.slug}` },
          ]),
          blogPostingJsonLd(post),
        ]}
      />
      <PageHeader
        wide
        eyebrow={resourceTypeLabels[post.type]}
        title={post.title}
        description={post.excerpt}
      />

      <ContentDetailShell
        backHref={routes.resources}
        backLabel="Back to Resources"
      >
        <ContentDetailMeta
          items={[
            { label: "Published", value: formattedDate },
            { label: "Type", value: resourceTypeLabels[post.type] },
          ]}
        />

        <ContentDetailMedia
          title={post.title}
          coverImage={post.coverImage}
          galleryImages={post.galleryImages}
        />

        <ContentDetailArticle>
          <RichTextContent
            html={post.content}
            className="prose-lg md:prose-xl prose-p:leading-[1.85]"
          />
        </ContentDetailArticle>
      </ContentDetailShell>

      <CtaSection />
    </>
  );
}
