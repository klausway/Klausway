import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/animation/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { JsonLd } from "@/components/json-ld";
import type { FaqGroup } from "@/lib/faqs";
import { faqPageJsonLd } from "@/lib/seo";
import { cn } from "@/lib/utils";

type FaqSectionProps = {
  group: FaqGroup;
  className?: string;
  /** When false, skip FAQPage JSON-LD (e.g. if schema is emitted elsewhere). */
  includeJsonLd?: boolean;
};

/**
 * Readable Q&A block for AEO — answers live in page HTML; matching FAQPage
 * schema is optional and mirrors the visible questions exactly.
 */
export function FaqSection({
  group,
  className,
  includeJsonLd = true,
}: FaqSectionProps) {
  return (
    <section
      id={group.id}
      className={cn("relative border-t border-border py-24", className)}
    >
      {includeJsonLd ? <JsonLd data={faqPageJsonLd(group.items)} /> : null}
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          align="left"
          eyebrow="FAQ"
          title={group.heading}
          description={group.description}
        />

        <div className="mx-auto mt-12 max-w-3xl divide-y divide-border border-y border-border">
          {group.items.map((item, i) => (
            <Reveal
              key={item.question}
              delay={((i % 3) * 100) as 0 | 100 | 200}
              className="py-8"
            >
              <h3 className="text-lg font-semibold tracking-tight md:text-xl">
                {item.question}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                {item.answer}
              </p>
            </Reveal>
          ))}
        </div>

        {group.relatedLinks && group.relatedLinks.length > 0 ? (
          <Reveal className="mx-auto mt-10 flex max-w-3xl flex-wrap gap-x-6 gap-y-2">
            {group.relatedLinks.map((link) => {
              const external = /^https?:\/\//.test(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="group inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700"
                >
                  {link.label}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              );
            })}
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
