import { Link } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { Instagram, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[color:var(--sage-deep)] text-[color:var(--cream)] pt-24 pb-10" data-testid="site-footer">
      <Marquee speed={30} gradient={false} className="mb-16">
        <span className="font-serif italic text-[15vw] md:text-[10vw] leading-none px-8 text-[color:var(--cream)]/90">
          Karan Pande — Photographer of Weddings, Pre-Wedding &amp; Cinematic Films —
        </span>
      </Marquee>

      <div className="mx-auto max-w-[1400px] px-6 md:px-10 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="eyebrow text-[color:var(--copper)]">Studio</div>
          <p className="mt-3 font-serif text-2xl leading-snug">Based in Sambhaji Nagar<br/>Available worldwide</p>
        </div>
        <div>
          <div className="eyebrow text-[color:var(--copper)]">Navigate</div>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/wedding" className="hover:text-[color:var(--copper)]">Wedding</Link></li>
            <li><Link to="/pre-wedding" className="hover:text-[color:var(--copper)]">Pre-Wedding</Link></li>
            <li><Link to="/cinematic" className="hover:text-[color:var(--copper)]">Cinematic</Link></li>
            <li><Link to="/contact" className="hover:text-[color:var(--copper)]">Contact</Link></li>
          </ul>
        </div>
        <div>
          <div className="eyebrow text-[color:var(--copper)]">Reach out</div>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-center gap-2"><Phone size={14}/> +91 98000 00000</li>
            <li className="flex items-center gap-2"><Mail size={14}/> hello@karanpande.in</li>
            <li className="flex items-center gap-2"><Instagram size={14}/> @karanpande</li>
          </ul>
        </div>
        <div>
          <div className="eyebrow text-[color:var(--copper)]">Colophon</div>
          <p className="mt-3 text-sm text-[color:var(--cream)]/80">
            Set in Cormorant Garamond &amp; Manrope. Photographed on Sony &amp; Canon.
            Built with care in {new Date().getFullYear()}.
          </p>
          <Link to="/admin/login" data-testid="footer-admin-link" className="mt-4 inline-block text-[10px] tracking-[0.3em] uppercase text-[color:var(--cream)]/60 hover:text-[color:var(--copper)]">
            Studio Access
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 md:px-10 mt-16 flex flex-col md:flex-row justify-between text-[10px] tracking-[0.3em] uppercase text-[color:var(--cream)]/60">
        <span>© {new Date().getFullYear()} Karan Pande</span>
        <span>Est. 2019 · Sambhaji Nagar</span>
      </div>
    </footer>
  );
}
