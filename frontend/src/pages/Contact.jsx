import { Instagram, Phone, Mail, MessageCircle } from "lucide-react";
import RevealHeading from "../components/site/RevealHeading";
import { FadeUp } from "../components/site/Reveal";

const CONTACTS = [
  { icon: Phone, label: "Phone", value: "+91 98000 00000", href: "tel:+919800000000", testid: "contact-phone" },
  { icon: MessageCircle, label: "WhatsApp", value: "Chat on WhatsApp", href: "https://wa.me/919800000000", testid: "contact-whatsapp" },
  { icon: Mail, label: "Email", value: "hello@karanpande.in", href: "mailto:hello@karanpande.in", testid: "contact-email" },
  { icon: Instagram, label: "Instagram", value: "@karanpande", href: "https://instagram.com/karanpande", testid: "contact-instagram" },
];

export default function Contact() {
  return (
    <div className="pt-32 md:pt-40 pb-32" data-testid="contact-page">
      <section className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="eyebrow">Chapter 04 · The Enquiry</div>
        <RevealHeading
          lines={["Let's talk about", "your wedding."]}
          className="font-serif italic text-[color:var(--ink)] text-[14vw] md:text-[10vw] leading-[0.9] mt-6 tracking-tight block"
        />
        <FadeUp delay={0.6}>
          <p className="mt-10 max-w-xl text-lg leading-relaxed text-[color:var(--ink)]/75">
            The nicest enquiries begin with a phone call or a note. Reach out on any
            of the channels below — I typically reply within a day.
          </p>
        </FadeUp>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 md:px-10 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {CONTACTS.map((c, i) => {
            const Icon = c.icon;
            return (
              <FadeUp key={c.label} delay={i * 0.08}>
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  data-testid={c.testid}
                  data-cursor="Open"
                  className="group block border border-[color:var(--ink)]/12 bg-[color:var(--surface)] px-8 py-10 md:px-12 md:py-14 hover:border-[color:var(--copper)] transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="eyebrow text-[color:var(--copper)]">{c.label}</div>
                      <div className="mt-3 font-serif text-3xl md:text-5xl group-hover:text-[color:var(--copper)] transition-colors">{c.value}</div>
                    </div>
                    <Icon size={32} className="text-[color:var(--ink)]/40 group-hover:text-[color:var(--copper)]" />
                  </div>
                </a>
              </FadeUp>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 md:px-10 mt-24 md:mt-32">
        <FadeUp>
          <div className="border-t border-[color:var(--ink)]/10 pt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="eyebrow">Studio</div>
              <p className="mt-3 font-serif text-2xl">Sambhaji Nagar, Maharashtra · India</p>
            </div>
            <div>
              <div className="eyebrow">Available for</div>
              <p className="mt-3 font-serif text-2xl">Weddings · Pre-Wedding · Cinematic Films</p>
            </div>
            <div>
              <div className="eyebrow">Travels</div>
              <p className="mt-3 font-serif text-2xl">Worldwide, on request</p>
            </div>
          </div>
        </FadeUp>
      </section>
    </div>
  );
}
