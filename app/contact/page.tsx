import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/animation/reveal";
import { BookingEmbed } from "@/components/booking-embed";
import { ContactForm } from "@/components/contact-form";
import { JsonLd } from "@/components/json-ld";
import { routes } from "@/lib/navigation";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildPageMetadata,
  siteConfig,
} from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description:
    "Tell us what's slowing you down. We reply within one business day.",
  path: routes.contact,
});

const contactCards = [
  {
    icon: MapPin,
    title: "Visit Us",
    value: "29 Northridge Drive North Windham, CT 06256",
    href: "https://maps.google.com/?q=29+Northridge+Drive+North+Windham+CT+06256",
    external: true,
  },
  {
    icon: Phone,
    title: "Call Us",
    value: "(860) 400-0758",
    href: "tel:+18604000758",
    external: false,
  },
  {
    icon: Mail,
    title: "Email Us",
    value: "support@klausway.com",
    href: "mailto:support@klausway.com",
    external: false,
  },
  {
    icon: Clock,
    title: "Business Hours",
    value: "Mon-Fri: 9:00 AM - 4:00 PM EST",
    href: undefined,
    external: false,
  },
];

const hasBooking = Boolean(process.env.NEXT_PUBLIC_CAL_LINK);

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: routes.home },
            { name: "Contact", path: routes.contact },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: `Contact ${siteConfig.name}`,
            description:
              "Tell us what's slowing you down. We reply within one business day.",
            url: absoluteUrl(routes.contact),
            mainEntity: {
              "@type": "Organization",
              name: siteConfig.name,
              email: siteConfig.email,
              telephone: siteConfig.phone,
            },
          },
        ]}
      />
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            Tell us what&apos;s{" "}
            <span className="text-brand-600">slowing you down</span>
          </>
        }
        description="We reply within one business day — and you'll hear back from the people who actually build the software."
      />

      <section id="contact" className="relative scroll-mt-28 pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {contactCards.map((item, i) => (
              <Reveal
                key={item.title}
                delay={((i % 4) * 100) as 0 | 100 | 200 | 300}
                className="hover-lift rounded-2xl border border-border bg-card p-6 shadow-card transition-colors hover:border-border-strong"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/15 text-brand-600">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {item.title}
                </h3>
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="mt-2 block text-sm font-medium leading-relaxed transition-colors hover:text-brand-600"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="mt-2 text-sm font-medium leading-relaxed">
                    {item.value}
                  </p>
                )}
              </Reveal>
            ))}
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <ContactForm />

            <Reveal delay={100} className="flex flex-col">
              <div className="flex-1 rounded-2xl border border-border bg-card p-6 shadow-card md:p-8">
                <h2 className="font-display text-2xl font-bold tracking-tight">
                  Our Location
                </h2>
                <p className="mt-4 text-sm font-medium">
                  29 Northridge Drive, North Windham, CT 06256
                </p>
                <div className="mt-6 aspect-[4/3] overflow-hidden rounded-xl border border-border bg-surface-2">
                  <iframe
                    title="Klaus Way office location"
                    src="https://maps.google.com/maps?q=29+Northridge+Drive+North+Windham+CT+06256&output=embed"
                    className="h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-card">
                <h3 className="font-display text-lg font-bold">
                  {hasBooking ? "Book a call" : "Schedule a Visit"}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {hasBooking
                    ? "Pick a time that works and we'll call you — no back-and-forth."
                    : "Please call ahead so someone from our team is available to meet with you."}
                </p>
                <BookingEmbed className="mt-4" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
