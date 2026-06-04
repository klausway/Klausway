import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./animation/reveal";
import { ContentCardCover } from "./content-card-cover";
import type { BlogPost } from "@/lib/blog";
import { routes } from "@/lib/navigation";

type BlogGridProps = {
  posts: BlogPost[];
  hideHeader?: boolean;
};

export function BlogGrid({ posts, hideHeader = false }: BlogGridProps) {
  return (
    <section className="relative pb-24">
      <div className="mx-auto max-w-7xl px-6">
        {!hideHeader && (
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2 className="text-balance text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              Our Blog
            </h2>
          </Reveal>
        )}

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal
              key={post.slug}
              delay={((i % 3) * 100) as 0 | 100 | 200}
              className="hover-lift group flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-card/40 backdrop-blur transition-all hover:border-white/10 hover:bg-card/60"
            >
              <ContentCardCover
                src={post.coverImage}
                alt={post.title}
                accent="from-brand-500/25 via-card/60 to-violet-500/15"
              />
              <div className="flex flex-1 flex-col p-6">
                <time
                  dateTime={post.date}
                  className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                >
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
                <h3 className="mt-3 text-xl font-semibold leading-snug tracking-tight transition-colors group-hover:text-brand-200">
                  {post.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>
                <Link
                  href={`${routes.blog}/${post.slug}`}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-300 transition-colors hover:text-brand-200"
                >
                  Read More
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
