import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { fetchMedia } from "../lib/api";
import RevealHeading from "../components/site/RevealHeading";
import { FadeUp } from "../components/site/Reveal";
import Lightbox from "../components/site/Lightbox";

/**
 * Photo gallery page reused for /wedding and /pre-wedding.
 */
export default function GalleryPage({ category, title, subtitle, chapter, next }) {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(null);

  useEffect(() => {
    fetchMedia(category).then(setItems).catch(() => {});
  }, [category]);

  // asymmetric layout classes cycled
  const spans = [
    "col-span-12 md:col-span-8 aspect-[16/10]",
    "col-span-12 md:col-span-4 aspect-[4/5]",
    "col-span-6 md:col-span-5 aspect-[4/5]",
    "col-span-6 md:col-span-7 aspect-[16/11]",
    "col-span-12 md:col-span-12 aspect-[21/9]",
    "col-span-6 md:col-span-4 aspect-[3/4]",
    "col-span-6 md:col-span-4 aspect-[3/4]",
    "col-span-12 md:col-span-4 aspect-[3/4]",
  ];

  return (
    <div className="pt-32 md:pt-40 pb-24" data-testid={`gallery-${category}`}>
      {/* Header */}
      <section className="mx-auto max-w-[1500px] px-6 md:px-10">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-10">
            <div className="eyebrow">{chapter} · The Folder</div>
            <RevealHeading
              lines={[title]}
              className="font-serif italic text-[color:var(--ink)] text-[14vw] md:text-[11vw] leading-[0.9] mt-6 tracking-tight block"
            />
          </div>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.8 }}
            className="col-span-12 md:col-span-2 md:pt-6 md:text-right"
          >
            <span className="eyebrow text-[color:var(--copper)]">{String(items.length).padStart(2, "0")} frames</span>
          </motion.div>
        </div>
        <FadeUp delay={0.4}>
          <p className="mt-8 md:mt-14 max-w-2xl text-lg leading-relaxed text-[color:var(--ink)]/75">
            {subtitle}
          </p>
        </FadeUp>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-[1500px] px-6 md:px-10 mt-20">
        <div className="grid grid-cols-12 gap-3 md:gap-5">
          {items.map((it, i) => (
            <FadeUp key={it.id} delay={(i % 4) * 0.06} className={spans[i % spans.length]}>
              <button
                onClick={() => setActive(it)}
                data-testid={`gallery-img-${i + 1}`}
                data-cursor="View"
                className="img-frame w-full h-full block"
              >
                <img src={it.url} alt={it.title || category} loading="lazy" />
              </button>
              {it.title && (
                <div className="mt-2 flex items-center justify-between text-[10px] tracking-[0.3em] uppercase text-[color:var(--ink)]/60">
                  <span>{it.title}</span>
                  <span className="text-[color:var(--copper)]">{String(i + 1).padStart(2, "0")}</span>
                </div>
              )}
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Next chapter */}
      {next && (
        <section className="mx-auto max-w-[1500px] px-6 md:px-10 mt-32 md:mt-48">
          <FadeUp>
            <div className="border-t border-[color:var(--ink)]/15 pt-10 flex items-end justify-between">
              <div>
                <div className="eyebrow">Next chapter</div>
                <Link to={next.to} data-testid="next-chapter" data-cursor="Open" className="font-serif italic text-6xl md:text-8xl block mt-3 hover:text-[color:var(--copper)] transition-colors">
                  {next.title}
                </Link>
              </div>
              <ArrowUpRight size={40} className="text-[color:var(--copper)]" />
            </div>
          </FadeUp>
        </section>
      )}

      <Lightbox open={!!active} onClose={() => setActive(null)}>
        {active && (
          <img src={active.url} alt={active.title || category} className="max-w-full max-h-[88vh] object-contain" />
        )}
      </Lightbox>
    </div>
  );
}
