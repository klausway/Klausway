import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/animation/reveal";
import { ContactForm } from "@/components/contact-form";
import { CtaSection } from "@/components/cta-section";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Ready to transform your IT infrastructure? Get in touch with Klaus Way.",
};

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
    value: "(860) 771-9058",
    href: "tel:+18607719058",
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

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Klaus Way"
        title={
          <>
            Get In{" "}
            <span className="text-gradient-animated">Touch</span>
          </>
        }
        description="Ready to transform your IT infrastructure? Let's start a conversation."
      />

      <section id="contact" className="relative scroll-mt-28 pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {contactCards.map((item, i) => (
              <Reveal
                key={item.title}
                delay={((i % 4) * 100) as 0 | 100 | 200 | 300}
                className="hover-lift rounded-2xl border border-black/[0.08] bg-card/40 p-6 backdrop-blur transition-all hover:border-black/10 hover:bg-card/60"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/15 text-brand-600">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
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
              <div className="flex-1 rounded-2xl border border-black/10 bg-gradient-to-br from-brand-500/10 via-card/40 to-fuchsia-500/5 p-6 backdrop-blur md:p-8">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Our Location
                </h2>
                <p className="mt-4 text-sm font-medium">
                  29 Northridge Drive, North Windham, CT 06256
                </p>
                <div className="mt-6 aspect-[4/3] overflow-hidden rounded-xl border border-black/10 bg-background/40">
                  <iframe
                    title="Klaus Way office location"
                    src="https://maps.google.com/maps?q=29+Northridge+Drive+North+Windham+CT+06256&output=embed"
                    className="h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-black/[0.08] bg-card/40 p-6 backdrop-blur">
                <h3 className="text-lg font-semibold">Schedule a Visit</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Please call ahead or book an appointment online to ensure
                  someone from our team is available to meet with you.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
