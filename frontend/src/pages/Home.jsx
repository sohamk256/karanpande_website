import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import Marquee from "react-fast-marquee";
import { ArrowUpRight } from "lucide-react";
import RevealHeading from "../components/site/RevealHeading";
import { FadeUp } from "../components/site/Reveal";
import { fetchAllMedia } from "../lib/api";

const HERO_VIDEO = "https://videos.pexels.com/video-files/5849887/5849887-uhd_2560_1440_24fps.mp4";
const HERO_POSTER = "https://images.pexels.com/photos/33419097/pexels-photo-33419097.jpeg?auto=compress&cs=tinysrgb&w=1600";

const CHAPTERS = [
  {
    n: "01",
    title: "Approach",
    body: "I photograph like I'd remember it — half poem, half document. Weddings unfold on their own choreography; I move quietly, keep the lens close, and let the story lead.",
  },
  {
    n: "02",
    title: "Craft",
    body: "Grain, warmth, and honest light. Every frame is graded to feel like a page from a private album — not a preset, but a memory colour that belongs to the two of you.",
  },
  {
    n: "03",
    title: "Delivery",
    body: "Hand-picked photographs, a printed proof book, and a cinematic film scored to a piece of music you&rsquo;ll love for decades. That&rsquo;s the shape of a shoot with me.",
  },
];

export default function Home() {
  const [wedding, setWedding] = useState([]);
  const [pre, setPre] = useState([]);
  const [cine, setCine] = useState([]);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const heroFade = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);

  useEffect(() => {
    fetchAllMedia().then((items) => {
      setWedding(items.filter((i) => i.category === "wedding"));
      setPre(items.filter((i) => i.category === "pre-wedding"));
      setCine(items.filter((i) => i.category === "cinematic"));
    }).catch(() => {});
  }, []);

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
        <motion.div style={{ y: heroY, scale: heroScale, opacity: heroFade }} className="absolute inset-0">
          <video
            className="w-full h-full object-cover"
            src={HERO_VIDEO}
            poster={HERO_POSTER}
            autoPlay
            muted
            loop
            playsInline
            data-testid="hero-video"
          />
          <div className="absolute inset-0 video-scrim" />
        </motion.div>

        {/* Top eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="absolute top-24 left-6 md:left-10 right-6 md:right-10 flex justify-between text-[color:var(--cream)]"
        >
          <span className="eyebrow text-[color:var(--copper)]">Est. 2019 · Sambhaji Nagar</span>
          <span className="eyebrow text-[color:var(--cream)]/80 hidden md:block">Chapter 01 — The Making</span>
        </motion.div>

        {/* Main headline anchored bottom-left */}
        <div className="absolute bottom-14 md:bottom-24 left-6 md:left-10 right-6 md:right-16 z-10">
          <div className="max-w-[1400px]">
            <RevealHeading
              className="font-serif italic text-[color:var(--cream)] leading-[0.9] tracking-tight text-[16vw] md:text-[11vw]"
              lines={["Weddings, held", "like heirlooms."]}
              delay={0.3}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.8 }}
              className="mt-6 md:mt-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
            >
              <p className="text-[color:var(--cream)]/85 max-w-xl text-base md:text-lg leading-relaxed">
                Karan Pande photographs weddings, pre-wedding stories and cinematic
                films across India — quiet, editorial, and unhurried.
              </p>
              <div className="flex items-center gap-3">
                <Link to="/wedding" data-testid="hero-cta-work" data-cursor="Enter" className="btn-pill filled">
                  See The Work <ArrowUpRight size={14} />
                </Link>
                <Link to="/contact" data-testid="hero-cta-contact" className="btn-pill" style={{ color: "var(--cream)", borderColor: "rgba(244,241,235,0.4)" }}>
                  Enquire
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2, duration: 0.8 }}
          className="absolute bottom-6 right-6 md:right-10 text-[color:var(--cream)]/70 text-[10px] tracking-[0.3em] uppercase"
        >
          Scroll ↓
        </motion.div>
      </section>

      {/* Marquee */}
      <section className="bg-[color:var(--cream)] border-y border-[color:var(--ink)]/10 py-8">
        <Marquee speed={40} gradient={false}>
          <span className="marquee-track text-[7vw] md:text-[5vw] leading-none px-6 text-[color:var(--ink)]">
            Weddings · Pre-Wedding · Cinematic · Sambhaji Nagar · Est. 2019 · A photographer's photographer · &nbsp;
          </span>
          <span className="marquee-track text-[7vw] md:text-[5vw] leading-none px-6 text-[color:var(--copper)]">
            Weddings · Pre-Wedding · Cinematic · Sambhaji Nagar · Est. 2019 · A photographer's photographer · &nbsp;
          </span>
        </Marquee>
      </section>

      {/* Numbered Manifesto */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 py-24 md:py-40">
        <div className="grid grid-cols-12 gap-6 md:gap-10">
          <FadeUp className="col-span-12 md:col-span-4">
            <div className="eyebrow">A brief manifesto</div>
            <h2 className="font-serif text-5xl md:text-6xl leading-[0.95] mt-6 tracking-tight">
              Three ideas<br/><em className="text-[color:var(--sage-deep)]">that shape</em><br/>the work.
            </h2>
          </FadeUp>
          <div className="col-span-12 md:col-span-8 md:pl-10">
            <div className="hairline" />
            {CHAPTERS.map((c, i) => (
              <FadeUp delay={i * 0.1} key={c.n}>
                <div className="grid grid-cols-12 gap-4 py-10 md:py-14 border-b border-[color:var(--ink)]/10">
                  <div className="col-span-3 md:col-span-2 font-serif text-3xl md:text-4xl text-[color:var(--copper)]">{c.n}</div>
                  <div className="col-span-9 md:col-span-10">
                    <h3 className="font-serif text-3xl md:text-4xl mb-3">{c.title}</h3>
                    <p className="text-[color:var(--ink)]/75 text-base md:text-lg leading-relaxed max-w-xl">{c.body}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Featured asymmetric grid */}
      <section className="mx-auto max-w-[1500px] px-6 md:px-10 pb-24">
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
          {feat1 && (
            <FadeUp className="col-span-12 md:col-span-8">
              <div className="img-frame aspect-[16/10]" data-cursor="View"><img src={feat1} alt="Wedding" /></div>
            </FadeUp>
          )}
          {feat2 && (
            <FadeUp delay={0.05} className="col-span-12 md:col-span-4">
              <div className="img-frame aspect-[4/5]" data-cursor="View"><img src={feat2} alt="Pre-wedding" /></div>
            </FadeUp>
          )}
          {feat3 && (
            <FadeUp delay={0.05} className="col-span-6 md:col-span-3">
              <div className="img-frame aspect-[3/4]" data-cursor="View"><img src={feat3} alt="Wedding" /></div>
            </FadeUp>
          )}
          {feat6 && (
            <FadeUp delay={0.1} className="col-span-6 md:col-span-5">
              <div className="img-frame aspect-[4/3]" data-cursor="Play"><img src={feat6} alt="Cinematic" /></div>
            </FadeUp>
          )}
          {feat4 && (
            <FadeUp delay={0.15} className="col-span-12 md:col-span-4">
              <div className="img-frame aspect-[16/11]" data-cursor="View"><img src={feat4} alt="Pre-wedding" /></div>
            </FadeUp>
          )}
          {feat5 && (
            <FadeUp delay={0.15} className="col-span-12 md:col-span-12">
              <div className="img-frame aspect-[21/9]" data-cursor="View"><img src={feat5} alt="Wedding" /></div>
            </FadeUp>
          )}
        </div>

        <div className="mt-10 flex md:hidden">
          <Link to="/wedding" className="btn-pill" data-testid="featured-see-all-mobile">
            See All Weddings <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>

      {/* Category CTAs */}
      <section className="bg-[color:var(--cream-2)] py-24 md:py-32 border-t border-[color:var(--ink)]/10">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <FadeUp>
            <div className="eyebrow">Bodies of work</div>
            <h2 className="font-serif text-5xl md:text-6xl mt-3 tracking-tight max-w-3xl">Three folders. One quiet voice.</h2>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 mt-14">
            {[
              { to: "/wedding", title: "Weddings", n: "01", img: feat1, testid: "cat-wedding" },
              { to: "/pre-wedding", title: "Pre-Wedding", n: "02", img: feat2, testid: "cat-prewedding" },
              { to: "/cinematic", title: "Cinematic", n: "03", img: feat6, testid: "cat-cinematic" },
            ].map((c, i) => (
              <FadeUp key={c.to} delay={i * 0.08}>
                <Link to={c.to} data-testid={c.testid} data-cursor="Open" className="group block">
                  <div className="img-frame aspect-[4/5] mb-4">{c.img && <img src={c.img} alt={c.title} />}</div>
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-serif text-3xl md:text-4xl">{c.title}</h3>
                    <span className="text-[color:var(--copper)] font-serif text-xl">{c.n}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-[color:var(--ink)]/70 group-hover:text-[color:var(--copper)] transition-colors">
                    Open the folder <ArrowUpRight size={12} />
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Quote / editorial pull */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 py-32 md:py-48">
        <FadeUp>
          <p className="font-serif italic text-3xl md:text-6xl leading-[1.05] tracking-tight max-w-5xl">
            &ldquo;Karan photographs the parts of a wedding you can&rsquo;t rehearse — the pauses, the glances, the way light lands on a hand.&rdquo;
          </p>
          <div className="mt-8 eyebrow">— Vogue Wedding Book, 2024</div>
        </FadeUp>
      </section>
    </div>
  );
}
