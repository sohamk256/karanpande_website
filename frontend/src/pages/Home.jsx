import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Quote, Star, Camera, Film, Sparkles } from "lucide-react";
import RevealHeading from "../components/site/RevealHeading";
import { FadeUp } from "../components/site/Reveal";
import { fetchAllAlbums, fetchAllMedia, fetchTestimonials } from "../lib/api";
import { useSettings } from "../lib/settings";

const CHAPTERS = [
  { n: "01", title: "Approach", body: "I photograph like I&rsquo;d remember it — half poem, half document. Weddings unfold on their own choreography; I move quietly, keep the lens close, and let the story lead." },
  { n: "02", title: "Craft", body: "Grain, warmth, and honest light. Every frame is graded to feel like a page from a private album — not a preset, but a memory colour that belongs to the two of you." },
  { n: "03", title: "Delivery", body: "Hand-picked photographs, a printed proof book, and a cinematic film scored to a piece of music you&rsquo;ll love for decades. That&rsquo;s the shape of a shoot with me." },
];

const SERVICES = [
  { icon: Camera, tag: "01", title: "Wedding Photography", desc: "Full-day, un-posed coverage across ceremonies, receptions and family portraits — delivered as a hand-selected gallery and a printed proof book.", bullets: ["1 lead + 1 second shooter", "300–600 edited photographs", "Printed proof book"] },
  { icon: Sparkles, tag: "02", title: "Pre-Wedding Stories", desc: "A half or full-day story shoot — outdoors, on location, or somewhere quietly meaningful to the two of you.", bullets: ["Concept &amp; location scouting", "80–160 edited photographs", "Optional short reel"] },
  { icon: Film, tag: "03", title: "Cinematic Films", desc: "Feature-length wedding films and 60-second social teasers — cut like short cinema, scored to a piece you&rsquo;ll love.", bullets: ["4K, multi-cam capture", "5–8 min wedding film", "Social-cut teaser"] },
];

const STATS = [
  { n: "120+", l: "Weddings" },
  { n: "38", l: "Cities" },
  { n: "6", l: "Years shooting" },
  { n: "5.0", l: "Avg. rating" },
];

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

  const feat1 = wedding[0]?.url;
  const feat2 = pre[0]?.url;
  const feat3 = wedding[2]?.url || wedding[1]?.url;
  const feat4 = pre[2]?.url || pre[1]?.url;
  const feat5 = wedding[3]?.url;
  const feat6 = cine[0]?.poster;

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

      {/* Editorial index (replaces marquee) */}
      <section className="bg-[color:var(--cream)] border-y border-[color:var(--ink)]/10">
        <div className="mx-auto max-w-[1500px] px-6 md:px-10 py-14 md:py-16 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
          {[
            { n: "01", title: "Weddings", sub: "Full-day, editorial coverage of Indian weddings — mandap to reception." },
            { n: "02", title: "Pre-Wedding", sub: "Story shoots outdoors, on location, or somewhere quietly meaningful." },
            { n: "03", title: "Cinematic", sub: "Feature-length wedding films &amp; social teasers, cut like short cinema." },
          ].map((s, i) => (
            <FadeUp key={s.n} delay={i * 0.06}>
              <div className="flex items-start gap-5 md:gap-6 md:border-l md:first:border-l-0 md:pl-8 md:first:pl-0 border-[color:var(--ink)]/10">
                <span className="font-serif italic text-4xl md:text-5xl text-[color:var(--copper)] leading-none">{s.n}</span>
                <div>
                  <h3 className="font-serif italic text-3xl md:text-4xl leading-tight">{s.title}</h3>
                  <p
                    className="mt-3 text-[color:var(--ink)]/70 text-sm md:text-base leading-relaxed max-w-xs"
                    dangerouslySetInnerHTML={{ __html: s.sub }}
                  />
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-[1500px] px-6 md:px-10 py-20 md:py-28">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {STATS.map((s, i) => (
            <FadeUp key={s.l} delay={i * 0.06}>
              <div className="border-t border-[color:var(--ink)]/15 pt-6">
                <div className="font-serif text-6xl md:text-7xl leading-none">{s.n}</div>
                <div className="mt-3 eyebrow">{s.l}</div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Manifesto */}
      <section className="mx-auto max-w-[1500px] px-6 md:px-10 pb-24 md:pb-40">
        <div className="grid grid-cols-12 gap-6 md:gap-10">
          <FadeUp className="col-span-12 md:col-span-4">
            <div className="eyebrow">A brief manifesto</div>
            <h2 className="font-serif text-5xl md:text-6xl leading-[0.95] mt-6 tracking-tight">
              Three ideas<br /><em className="text-[color:var(--sage-deep)]">that shape</em><br />the work.
            </h2>
          </FadeUp>
          <div className="col-span-12 md:col-span-8 md:pl-10">
            <div className="hairline" />
            {CHAPTERS.map((c, i) => (
              <FadeUp delay={i * 0.08} key={c.n}>
                <div className="grid grid-cols-12 gap-4 py-10 md:py-14 border-b border-[color:var(--ink)]/10">
                  <div className="col-span-3 md:col-span-2 font-serif text-3xl md:text-4xl text-[color:var(--copper)]">{c.n}</div>
                  <div className="col-span-9 md:col-span-10">
                    <h3 className="font-serif text-3xl md:text-4xl mb-3">{c.title}</h3>
                    <p
                      className="text-[color:var(--ink)]/75 text-base md:text-lg leading-relaxed max-w-xl"
                      dangerouslySetInnerHTML={{ __html: c.body }}
                    />
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* About Karan */}
      <section className="bg-[color:var(--cream-2)] border-t border-[color:var(--ink)]/10 py-24 md:py-40" data-testid="about-section">
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

            <FadeUp delay={0.24}>
              <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-6 border-t border-[color:var(--ink)]/15 pt-8">
                <div>
                  <div className="eyebrow">Based in</div>
                  <div className="font-serif text-2xl mt-2">Sambhaji Nagar</div>
                </div>
                <div>
                  <div className="eyebrow">Travels</div>
                  <div className="font-serif text-2xl mt-2">Worldwide</div>
                </div>
                <div>
                  <div className="eyebrow">Language</div>
                  <div className="font-serif text-2xl mt-2">EN · HI · MR</div>
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.32}>
              <div className="mt-12 flex items-center gap-6">
                <span
                  className="font-serif italic text-4xl md:text-5xl text-[color:var(--copper)] leading-none"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Karan Pande
                </span>
                <span className="eyebrow text-[color:var(--ink)]/50">— Photographer &amp; Founder</span>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Featured asymmetric grid */}
      <section className="mx-auto max-w-[1600px] px-6 md:px-10 pb-24">
        <FadeUp>
          <div className="flex items-end justify-between mb-10 md:mb-16">
            <div>
              <div className="eyebrow">Selected frames</div>
              <h2 className="font-serif text-5xl md:text-6xl mt-3 tracking-tight">A recent index.</h2>
            </div>
            <Link to="/wedding" className="btn-pill hidden md:inline-flex" data-testid="featured-see-all">
              See All Weddings <ArrowUpRight size={14} />
            </Link>
          </div>
        </FadeUp>

        <div className="grid grid-cols-12 gap-3 md:gap-5">
          {feat1 && <FadeUp className="col-span-12 md:col-span-8"><div className="img-frame aspect-[16/10]"><img src={feat1} alt="Wedding" /></div></FadeUp>}
          {feat2 && <FadeUp delay={0.05} className="col-span-12 md:col-span-4"><div className="img-frame aspect-[4/5]"><img src={feat2} alt="Pre-wedding" /></div></FadeUp>}
          {feat3 && <FadeUp delay={0.05} className="col-span-6 md:col-span-3"><div className="img-frame aspect-[3/4]"><img src={feat3} alt="Wedding" /></div></FadeUp>}
          {feat6 && <FadeUp delay={0.1} className="col-span-6 md:col-span-5"><div className="img-frame aspect-[4/3]"><img src={feat6} alt="Cinematic" /></div></FadeUp>}
          {feat4 && <FadeUp delay={0.15} className="col-span-12 md:col-span-4"><div className="img-frame aspect-[16/11]"><img src={feat4} alt="Pre-wedding" /></div></FadeUp>}
          {feat5 && <FadeUp delay={0.15} className="col-span-12 md:col-span-12"><div className="img-frame aspect-[21/9]"><img src={feat5} alt="Wedding" /></div></FadeUp>}
        </div>
      </section>

      {/* Category folders */}
      <section className="bg-[color:var(--cream-2)] py-24 md:py-32 border-t border-[color:var(--ink)]/10">
        <div className="mx-auto max-w-[1500px] px-6 md:px-10">
          <FadeUp>
            <div className="eyebrow">Bodies of work</div>
            <h2 className="font-serif text-5xl md:text-6xl mt-3 tracking-tight max-w-3xl">Three folders. One quiet voice.</h2>
            <p className="mt-5 max-w-xl text-[color:var(--ink)]/70 text-base md:text-lg">Every folder holds a set of couples&rsquo; stories — open one to see the frames in full.</p>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 mt-14">
            {[
              { to: "/wedding", title: "Weddings", n: "01", img: feat1, count: weddingAlbums.length, testid: "cat-wedding" },
              { to: "/pre-wedding", title: "Pre-Wedding", n: "02", img: feat2, count: preAlbums.length, testid: "cat-prewedding" },
              { to: "/cinematic", title: "Cinematic", n: "03", img: feat6, count: cineAlbums.length, testid: "cat-cinematic" },
            ].map((c, i) => (
              <FadeUp key={c.to} delay={i * 0.08}>
                <Link to={c.to} data-testid={c.testid} className="group block">
                  <div className="img-frame aspect-[4/5] mb-4">{c.img && <img src={c.img} alt={c.title} />}</div>
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-serif text-3xl md:text-4xl">{c.title}</h3>
                    <span className="text-[color:var(--copper)] font-serif text-xl">{c.n}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-[color:var(--ink)]/70 group-hover:text-[color:var(--copper)] transition-colors">
                    {c.count} albums <ArrowUpRight size={12} />
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-[1500px] px-6 md:px-10 py-28 md:py-40">
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
      </section>

      {/* Happy Customers / Testimonials */}
      <section className="bg-[color:var(--sage-deep)] text-[color:var(--cream)] py-28 md:py-40" data-testid="testimonials-section">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-16">
            {testimonials.map((t, i) => (
              <FadeUp key={t.id} delay={i * 0.08}>
                <article
                  data-testid={`testimonial-${i + 1}`}
                  className="relative bg-[color:var(--cream)] text-[color:var(--ink)] p-8 md:p-10 h-full flex flex-col"
                >
                  <Quote size={32} className="text-[color:var(--copper)] mb-6" />
                  <p className="font-serif text-2xl md:text-3xl leading-[1.25] italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-auto pt-8 flex items-center justify-between border-t border-[color:var(--ink)]/10 mt-8">
                    <div>
                      <div className="font-serif text-xl">{t.author}</div>
                      <div className="text-[10px] tracking-[0.28em] uppercase text-[color:var(--ink)]/60 mt-1">{t.role}</div>
                    </div>
                    <div className="flex gap-1 text-[color:var(--copper)]">
                      {[...Array(t.rating || 5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                    </div>
                  </div>
                </article>
              </FadeUp>
            ))}
          </div>

          {testimonials.length === 0 && (
            <p className="mt-12 text-[color:var(--cream)]/70">Testimonials coming soon.</p>
          )}
        </div>
      </section>

      {/* Closing CTA */}
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
