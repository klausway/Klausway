import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { resourceTypeLabels, type ResourcePost } from "@/lib/blog";
import { routes } from "@/lib/navigation";

type RelatedResourcesProps = {
  posts: ResourcePost[];
};

export function RelatedResources({ posts }: RelatedResourcesProps) {
  if (posts.length === 0) return null;

  return (
    <section className="border-t border-border bg-muted/30 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
          Keep reading
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          More Klaus Way resources on modernizing operations, apps, and IT.
        </p>
        <ul className="mt-8 grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`${routes.resources}/${post.slug}/`}
                className="group block"
              >
                <p className="text-xs font-medium uppercase tracking-wider text-brand-600">
                  {resourceTypeLabels[post.type]}
                </p>
                <p className="mt-2 font-display text-lg font-semibold leading-snug tracking-tight group-hover:text-brand-600">
                  {post.title}
                </p>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {post.excerpt}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-600">
                  Read
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
