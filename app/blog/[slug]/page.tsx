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
import { getBlogPost } from "@/lib/blog-data";
import { routes } from "@/lib/navigation";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <PageHeader
        wide
        eyebrow="Blog"
        title={post.title}
        description={post.excerpt}
      />

      <ContentDetailShell backHref={routes.blog} backLabel="Back to Blog">
        <ContentDetailMeta
          items={[
            { label: "Published", value: formattedDate },
            { label: "Reading", value: "Article" },
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
