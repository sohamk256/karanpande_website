import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import RevealHeading from "../components/site/RevealHeading";
import { FadeUp } from "../components/site/Reveal";
import Lightbox from "../components/site/Lightbox";
import { fetchMedia } from "../lib/api";

export default function CinematicPage() {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(null);

  useEffect(() => { fetchMedia("cinematic").then(setItems).catch(() => {}); }, []);

  return (
    <div className="pt-32 md:pt-40 pb-24" data-testid="gallery-cinematic">
      <section className="mx-auto max-w-[1500px] px-6 md:px-10">
        <div className="eyebrow">Chapter 03 · The Folder</div>
        <RevealHeading
          lines={["Cinematic"]}
          className="font-serif italic text-[color:var(--ink)] text-[14vw] md:text-[11vw] leading-[0.9] mt-6 tracking-tight block"
        />
        <FadeUp delay={0.4}>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[color:var(--ink)]/75">
            Feature-length wedding films, teasers, and reels — cut to feel like short cinema
            rather than a highlights reel. Music, breath, silence.
          </p>
        </FadeUp>
      </section>

      <section className="mx-auto max-w-[1500px] px-6 md:px-10 mt-20">
        <div className="grid grid-cols-12 gap-4 md:gap-8">
          {items.map((v, i) => (
            <FadeUp key={v.id} delay={(i % 3) * 0.08} className={i === 0 ? "col-span-12" : "col-span-12 md:col-span-6"}>
              <button
                onClick={() => setActive(v)}
                data-testid={`cine-play-${i + 1}`}
                data-cursor="Play"
                className="img-frame w-full block group"
                style={{ aspectRatio: i === 0 ? "21 / 9" : "16 / 9" }}
              >
                {v.poster && <img src={v.poster} alt={v.title} />}
                <div className="absolute inset-0 bg-[color:var(--ink)]/25 group-hover:bg-[color:var(--ink)]/10 transition-colors flex items-center justify-center">
                  <span className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-[color:var(--copper)]/95 flex items-center justify-center text-[color:var(--cream)] transition-transform group-hover:scale-110">
                    <Play size={28} fill="currentColor" />
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between text-[color:var(--cream)]">
                  <span className="font-serif italic text-2xl md:text-3xl">{v.title}</span>
                  <span className="text-[10px] tracking-[0.3em] uppercase self-end">Film {String(i + 1).padStart(2, "0")}</span>
                </div>
                {v.caption && (
                  <div className="absolute top-4 left-4 text-[10px] tracking-[0.3em] uppercase text-[color:var(--cream)]/80">
                    {v.caption}
                  </div>
                )}
              </button>
            </FadeUp>
          ))}
        </div>
      </section>

      <Lightbox open={!!active} onClose={() => setActive(null)}>
        {active && (
          <video src={active.url} controls autoPlay className="max-w-[92vw] max-h-[86vh]" data-testid="lightbox-video" />
        )}
      </Lightbox>
    </div>
  );
}
