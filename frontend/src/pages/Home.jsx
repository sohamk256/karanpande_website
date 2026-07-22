import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowUpRight, Quote, Star, Camera, Film, Sparkles,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import RevealHeading from "../components/site/RevealHeading";
import { FadeUp } from "../components/site/Reveal";
import { fetchAllAlbums, fetchAllMedia, fetchTestimonials } from "../lib/api";
import { useSettings } from "../lib/settings";

const CHAPTERS = [
  { n: "01", title: "Approach", body: "I photograph like I&rsquo;d remember it — half poem, half document. Weddings unfold on their own choreography; I move quietly, keep the lens close, and let the story lead." },
  { n: "02", title: "Craft", body: "Grain, warmth, and honest light. Every frame is graded to feel like a page from a private album — not a preset, but a memory colour that belongs to the two of you." },
  { n: "03", title: "Delivery", body: "Hand-picked photographs, a printed proof book, and a cinematic film scored to a piece of music you&rsquo;ll love for decades." },
];

const SERVICES = [
  { icon: Camera, tag: "01", title: "Wedding Photography", desc: "Full-day, un-posed coverage across ceremonies, receptions and family portraits — delivered as a hand-selected gallery and a printed proof book.", bullets: ["1 lead + 1 second shooter", "300–600 edited photographs", "Printed proof book"] },
  { icon: Sparkles, tag: "02", title: "Pre-Wedding Stories", desc: "A half or full-day story shoot — outdoors, on location, or somewhere quietly meaningful to the two of you.", bullets: ["Concept &amp; location scouting", "80–160 edited photographs", "Optional short reel"] },
  { icon: Film, tag: "03", title: "Cinematic Films", desc: "Feature-length wedding films and 60-second social teasers — cut like short cinema, scored to a piece you&rsquo;ll love.", bullets: ["4K, multi-cam capture", "5–8 min wedding film", "Social-cut teaser"] },
];

const STATS = [
  { n: "120+", l: "Weddings shot" },
  { n: "38", l: "Cities travelled" },
  { n: "6", l: "Years shooting" },
  { n: "5.0", l: "Average rating" },
];

/* ----------------------------- Testimonial slider ----------------------------- */
function TestimonialSlider({ items }) {
  const trackRef = useRef(null);
  const [idx, setIdx] = useState(0);
  const count = items.length;

  const scrollToIdx = (n) => {
    const clamped = ((n % count) + count) % count;
    setIdx(clamped);
    const el = trackRef.current;
    if (!el) return;
    const cards = el.querySelectorAll("[data-slider-card]");
    if (cards[clamped]) {
      cards[clamped].scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
    }
  };

  // auto-advance
  useEffect(() => {
    if (count === 0) return;
    const id = setInterval(() => scrollToIdx(idx + 1), 6500);
    return () => clearInterval(id);
    // eslint-disable-next-line
  }, [idx, count]);

  if (count === 0) return null;

  return (
    <div className="mt-12 md:mt-16" data-testid="testimonial-slider">
      <div
        ref={trackRef}
        className="flex gap-6 md:gap-8 overflow-x-auto pb-6 snap-x snap-mandatory -mx-6 md:-mx-10 px-6 md:px-10"
        style={{ scrollbarWidth: "none" }}
      >
        {items.map((t, i) => (
          <motion.article
            key={t.id}
            data-slider-card
            data-testid={`testimonial-${i + 1}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
            className="snap-start shrink-0 w-[86%] sm:w-[70%] md:w-[46%] lg:w-[38%] bg-[color:var(--cream)] text-[color:var(--ink)] p-8 md:p-10 flex flex-col"
          >
            <Quote size={30} className="text-[color:var(--copper)] mb-5" />
            <p className="font-serif italic text-2xl md:text-3xl leading-[1.25]">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="mt-auto pt-8">
              <div className="border-t border-[color:var(--ink)]/10 pt-6 flex items-center justify-between">
                <div>
                  <div className="font-serif text-xl">{t.author}</div>
                  <div className="text-[10px] tracking-[0.28em] uppercase text-[color:var(--ink)]/60 mt-1">{t.role}</div>
                </div>
                <div className="flex gap-1 text-[color:var(--copper)]">
                  {[...Array(t.rating || 5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <div className="mt-8 flex items-center gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => scrollToIdx(idx - 1)}
            data-testid="testimonial-prev"
            className="w-12 h-12 rounded-full border border-[color:var(--cream)]/40 flex items-center justify-center hover:bg-[color:var(--cream)] hover:text-[color:var(--sage-deep)] transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scrollToIdx(idx + 1)}
            data-testid="testimonial-next"
            className="w-12 h-12 rounded-full border border-[color:var(--cream)]/40 flex items-center justify-center hover:bg-[color:var(--cream)] hover:text-[color:var(--sage-deep)] transition-colors"
            aria-label="Next"
          >
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="flex-1 h-px bg-[color:var(--cream)]/20 relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-[color:var(--copper)]"
            animate={{ width: `${((idx + 1) / count) * 100}%` }}
            transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          />
        </div>
        <div className="eyebrow text-[color:var(--cream)]/70">
          {String(idx + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- Featured collage ----------------------------- */
function FeaturedCollage({ frames }) {
  if (frames.length === 0) return null;
  const [f1, f2, f3, f4, f5, f6] = frames;

  const cell = "img-frame h-full w-full block";
  const cap = (i, label) => (
    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[10px] tracking-[0.28em] uppercase text-[color:var(--cream)] drop-shadow">
      <span>{label}</span>
      <span className="text-[color:var(--copper)]">Nº {String(i).padStart(2, "0")}</span>
    </div>
  );

  return (
    <div className="grid grid-cols-12 grid-rows-6 md:grid-rows-4 gap-3 md:gap-4 md:h-[76vh]">
      {/* Big feature */}
      {f1 && (
        <FadeUp className="relative col-span-12 md:col-span-8 row-span-3 md:row-span-3">
          <div className={cell}><img src={f1.url} alt={f1.title || "Featured"} /></div>
          {cap(1, f1.title || "Wedding")}
        </FadeUp>
      )}

      {/* Tall right */}
      {f2 && (
        <FadeUp delay={0.05} className="relative col-span-6 md:col-span-4 row-span-1 md:row-span-2">
          <div className={cell}><img src={f2.url} alt={f2.title || "Featured"} /></div>
          {cap(2, f2.title || "Pre-Wedding")}
        </FadeUp>
      )}

      {/* Small right */}
      {f3 && (
        <FadeUp delay={0.10} className="relative col-span-6 md:col-span-4 row-span-1 md:row-span-1">
          <div className={cell}><img src={f3.url} alt={f3.title || "Featured"} /></div>
          {cap(3, f3.title || "Cinematic")}
        </FadeUp>
      )}

      {/* Row 4 — three side by side */}
      {f4 && (
        <FadeUp delay={0.15} className="relative col-span-4 md:col-span-4 row-span-1 md:row-span-1">
          <div className={cell}><img src={f4.url} alt={f4.title || "Featured"} /></div>
          {cap(4, f4.title || "Frame")}
        </FadeUp>
      )}
      {f5 && (
        <FadeUp delay={0.20} className="relative col-span-4 md:col-span-4 row-span-1 md:row-span-1">
          <div className={cell}><img src={f5.url} alt={f5.title || "Featured"} /></div>
          {cap(5, f5.title || "Frame")}
        </FadeUp>
      )}
      {f6 && (
        <FadeUp delay={0.25} className="relative col-span-4 md:col-span-4 row-span-1 md:row-span-1">
          <div className={cell}><img src={f6.url} alt={f6.title || "Featured"} /></div>
          {cap(6, f6.title || "Frame")}
        </FadeUp>
      )}
    </div>
  );
}

/* ---------------------------------- Home page ---------------------------------- */
export default function Home() {
  const [albums, setAlbums] = useState([]);
  const [media, setMedia] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const { settings } = useSettings();

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const heroFade = useTransform(scrollYProgress, [0, 0.85], [1, 0.35]);

  useEffect(() => {
    fetchAllAlbums().then(setAlbums).catch(() => {});
    fetchAllMedia().then(setMedia).catch(() => {});
    fetchTestimonials().then(setTestimonials).catch(() => {});
  }, []);

  const weddingAlbums = albums.filter((a) => a.category === "wedding");
  const preAlbums = albums.filter((a) => a.category === "pre-wedding");
  const cineAlbums = albums.filter((a) => a.category === "cinematic");

  const wedding = media.filter((m) => m.category === "wedding");
  const pre = media.filter((m) => m.category === "pre-wedding");
  const cine = media.filter((m) => m.category === "cinematic");

  // Assemble featured frames (mix categories, prefer titled items)
  const featured = [
    wedding[0],
    pre[0],
    { ...(cine[0] || {}), url: cine[0]?.poster },
    wedding[2] || wedding[1],
    pre[2] || pre[1],
    wedding[3],
  ].filter((f) => f && f.url);

  return (
    <div data-testid="home-page">
      {/* HERO */}
      <section ref={heroRef} className="relative h-[100svh] w-full overflow-hidden">
        <motion.div style={{ y: heroY, opacity: heroFade }} className="absolute inset-0">
          <video
            key={settings?.hero_video_url || "default-hero"}
            className="w-full h-full object-cover"
            src={settings?.hero_video_url}
            poster={settings?.hero_poster_url}
            autoPlay muted loop playsInline
            data-testid="hero-video"
          />
          <div className="absolute inset-0 video-scrim" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 1 }}
          className="absolute top-24 left-6 md:left-10 right-6 md:right-10 flex justify-between text-[color:var(--cream)]"
        >
          <span className="eyebrow text-[color:var(--copper)]">Est. 2019 · Sambhaji Nagar</span>
          <span className="eyebrow text-[color:var(--cream)]/80 hidden md:block">Shutter Shots by KP</span>
        </motion.div>

        <div className="absolute bottom-14 md:bottom-24 left-6 md:left-10 right-6 md:right-16 z-10">
          <div className="max-w-[1500px]">
            <RevealHeading
              className="font-serif italic text-[color:var(--cream)] leading-[0.9] tracking-tight text-[16vw] md:text-[11vw]"
              lines={settings ? [settings.hero_headline_1, settings.hero_headline_2] : ["Weddings, held", "like heirlooms."]}
              delay={0.35}
              key={settings ? `${settings.hero_headline_1}-${settings.hero_headline_2}` : "hero"}
            />
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.0, duration: 1 }}
              className="mt-6 md:mt-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
            >
              <p className="text-[color:var(--cream)]/85 max-w-xl text-base md:text-lg leading-relaxed">
                {settings?.hero_subtitle}
              </p>
              <div className="flex items-center gap-3">
                <Link to="/wedding" data-testid="hero-cta-work" className="btn-pill filled">See The Work <ArrowUpRight size={14} /></Link>
                <Link to="/contact" data-testid="hero-cta-contact" className="btn-pill" style={{ color: "var(--cream)", borderColor: "rgba(244,241,235,0.4)" }}>Enquire</Link>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4, duration: 1 }}
          className="absolute bottom-6 right-6 md:right-10 text-[color:var(--cream)]/70 text-[10px] tracking-[0.3em] uppercase"
        >
          Scroll ↓
        </motion.div>
      </section>

      {/* ---------- FEATURED COLLAGE — directly under the hero, single viewport ---------- */}
      <section className="mx-auto max-w-[1600px] px-6 md:px-10 py-14 md:py-10 md:min-h-screen md:flex md:flex-col md:justify-center" data-testid="featured-section">
        <FadeUp>
          <div className="flex items-end justify-between mb-6 md:mb-8 gap-4 flex-wrap">
            <div>
              <div className="eyebrow">Selected frames</div>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mt-2 tracking-tight">A recent index.</h2>
            </div>
            <Link to="/wedding" className="btn-pill" data-testid="featured-see-all">
              See All Weddings <ArrowUpRight size={14} />
            </Link>
          </div>
        </FadeUp>
        <FeaturedCollage frames={featured} />
      </section>

      {/* ---------- Category folders / Albums ---------- */}
      <section className="bg-[color:var(--cream-2)] py-24 md:py-32 border-t border-[color:var(--ink)]/10" data-testid="folders-section">
        <div className="mx-auto max-w-[1500px] px-6 md:px-10">
          <FadeUp>
            <div className="eyebrow">Bodies of work</div>
            <h2 className="font-serif text-5xl md:text-6xl mt-3 tracking-tight max-w-3xl">Three folders. One quiet voice.</h2>
            <p className="mt-5 max-w-xl text-[color:var(--ink)]/70 text-base md:text-lg">
              Each folder holds a set of couples&rsquo; stories — open any album to see the frames in full.
            </p>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 mt-14">
            {[
              { to: "/wedding", title: "Weddings", n: "01", img: wedding[0]?.url, count: weddingAlbums.length, testid: "cat-wedding" },
              { to: "/pre-wedding", title: "Pre-Wedding", n: "02", img: pre[0]?.url, count: preAlbums.length, testid: "cat-prewedding" },
              { to: "/cinematic", title: "Cinematic", n: "03", img: cine[0]?.poster, count: cineAlbums.length, testid: "cat-cinematic" },
            ].map((c, i) => (
              <FadeUp key={c.to} delay={i * 0.08}>
                <Link to={c.to} data-testid={c.testid} className="group block">
                  <div className="img-frame aspect-[4/5] mb-4">{c.img && <img src={c.img} alt={c.title} />}</div>
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-serif text-3xl md:text-4xl">{c.title}</h3>
                    <span className="text-[color:var(--copper)] font-serif text-xl">{c.n}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-[color:var(--ink)]/70 group-hover:text-[color:var(--copper)] transition-colors">
                    {c.count} {c.count === 1 ? "album" : "albums"} <ArrowUpRight size={12} />
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>

          {/* Small manifesto under the albums */}
          <div className="mt-20 md:mt-28" data-testid="manifesto-section">
            <FadeUp>
              <div className="flex items-baseline justify-between flex-wrap gap-3">
                <div>
                  <div className="eyebrow">A brief manifesto</div>
                  <h3 className="font-serif italic text-2xl md:text-3xl mt-2">Three ideas that shape the work.</h3>
                </div>
              </div>
            </FadeUp>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
              {CHAPTERS.map((c, i) => (
                <FadeUp key={c.n} delay={i * 0.06}>
                  <div className="border-t border-[color:var(--ink)]/15 pt-5">
                    <div className="flex items-baseline gap-3">
                      <span className="font-serif text-2xl text-[color:var(--copper)]">{c.n}</span>
                      <h4 className="font-serif text-2xl">{c.title}</h4>
                    </div>
                    <p
                      className="mt-3 text-sm text-[color:var(--ink)]/70 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: c.body }}
                    />
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- About Karan (with experience/stats embedded) ---------- */}
      <section className="py-24 md:py-40" data-testid="about-section">
        <div className="mx-auto max-w-[1500px] px-6 md:px-10 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-start">
          <FadeUp className="md:col-span-5">
            <div className="img-frame aspect-[4/5]">
              <img
                src="https://images.unsplash.com/photo-1554080353-a576cf803bda?auto=format&fit=crop&w=1200&q=80"
                alt="Karan Pande — photographer"
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-[10px] tracking-[0.28em] uppercase text-[color:var(--ink)]/60">
              <span>Sony · Canon</span>
              <span>35mm · 85mm</span>
              <span>Est. 2019</span>
            </div>
          </FadeUp>

          <div className="md:col-span-7 md:pl-4">
            <FadeUp>
              <div className="eyebrow">About the photographer</div>
              <h2 className="font-serif text-5xl md:text-6xl mt-3 tracking-tight leading-[0.98]">
                Hello, I&rsquo;m <em className="text-[color:var(--sage-deep)]">Karan.</em>
              </h2>
            </FadeUp>
            <FadeUp delay={0.08}>
              <p className="mt-8 text-lg md:text-xl text-[color:var(--ink)]/80 leading-relaxed max-w-2xl">
                I photograph weddings, pre-wedding stories, and cinematic films out of a small studio in
                Sambhaji Nagar. Six years in, I&rsquo;m still moved by the same three things — first looks,
                the last dance, and the way sunlight lands on a mother&rsquo;s hand.
              </p>
            </FadeUp>
            <FadeUp delay={0.16}>
              <p className="mt-6 text-base md:text-lg text-[color:var(--ink)]/70 leading-relaxed max-w-2xl">
                My work sits somewhere between documentary and editorial. I don&rsquo;t direct much,
                I don&rsquo;t re-shoot the vows, and I don&rsquo;t chase trends in colour. I photograph
                what actually happens — quietly, on foot, and close enough to hear you laugh.
              </p>
            </FadeUp>

            {/* Experience / stats moved into About */}
            <FadeUp delay={0.24}>
              <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 border-t border-[color:var(--ink)]/15 pt-8" data-testid="about-stats">
                {STATS.map((s) => (
                  <div key={s.l}>
                    <div className="font-serif text-4xl md:text-5xl leading-none">{s.n}</div>
                    <div className="mt-3 eyebrow">{s.l}</div>
                  </div>
                ))}
              </div>
            </FadeUp>

            <FadeUp delay={0.32}>
              <div className="mt-12 flex items-center gap-6 flex-wrap">
                <span className="font-serif italic text-4xl md:text-5xl text-[color:var(--copper)] leading-none">
                  Karan Pande
                </span>
                <span className="eyebrow text-[color:var(--ink)]/50">— Photographer &amp; Founder</span>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ---------- Services ---------- */}
      <section className="bg-[color:var(--cream-2)] border-t border-[color:var(--ink)]/10 py-24 md:py-32">
        <div className="mx-auto max-w-[1500px] px-6 md:px-10">
          <FadeUp>
            <div className="eyebrow">What I offer</div>
            <h2 className="font-serif text-5xl md:text-6xl mt-3 tracking-tight max-w-3xl">Made with care, delivered slowly.</h2>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-14">
            {SERVICES.map((s, i) => {
              const Icon = s.icon;
              return (
                <FadeUp key={s.title} delay={i * 0.08}>
                  <div className="h-full border border-[color:var(--ink)]/12 bg-[color:var(--surface)] p-8 md:p-10 flex flex-col">
                    <div className="flex items-center justify-between">
                      <Icon size={22} className="text-[color:var(--copper)]" />
                      <span className="font-serif text-[color:var(--copper)] text-xl">{s.tag}</span>
                    </div>
                    <h3 className="font-serif text-3xl md:text-4xl mt-8">{s.title}</h3>
                    <p
                      className="mt-4 text-[color:var(--ink)]/75 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: s.desc }}
                    />
                    <ul className="mt-6 space-y-2 text-sm text-[color:var(--ink)]/70 border-t border-[color:var(--ink)]/10 pt-6">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2">
                          <span className="text-[color:var(--copper)]">◆</span>
                          <span dangerouslySetInnerHTML={{ __html: b }} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- Testimonials — SLIDER ---------- */}
      <section className="bg-[color:var(--sage-deep)] text-[color:var(--cream)] py-24 md:py-40" data-testid="testimonials-section">
        <div className="mx-auto max-w-[1500px] px-6 md:px-10">
          <FadeUp>
            <div className="flex items-end justify-between flex-wrap gap-6">
              <div>
                <div className="eyebrow text-[color:var(--copper)]">Happy couples</div>
                <h2 className="font-serif italic text-5xl md:text-7xl mt-3 tracking-tight leading-[0.95]">
                  Notes from<br />the families.
                </h2>
              </div>
              <div className="flex items-center gap-2 text-[color:var(--cream)]/85">
                {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                <span className="ml-2 eyebrow text-[color:var(--cream)]/80">5.0 · Google &amp; Instagram</span>
              </div>
            </div>
          </FadeUp>

          <TestimonialSlider items={testimonials} />

          {testimonials.length === 0 && (
            <p className="mt-12 text-[color:var(--cream)]/70">Testimonials coming soon.</p>
          )}
        </div>
      </section>

      {/* ---------- Closing CTA ---------- */}
      <section className="mx-auto max-w-[1500px] px-6 md:px-10 py-32 md:py-44">
        <FadeUp>
          <div className="grid grid-cols-12 gap-6 items-end">
            <div className="col-span-12 md:col-span-8">
              <div className="eyebrow">Ready when you are</div>
              <p className="font-serif italic text-4xl md:text-7xl leading-[1.02] tracking-tight mt-4">
                Let&rsquo;s make photographs<br />you&rsquo;ll open in twenty years.
              </p>
            </div>
            <div className="col-span-12 md:col-span-4 md:text-right">
              <Link to="/contact" className="btn-pill filled" data-testid="closing-cta">Begin an enquiry <ArrowUpRight size={14} /></Link>
            </div>
          </div>
        </FadeUp>
      </section>
    </div>
  );
}
