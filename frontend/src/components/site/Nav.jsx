import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";

const links = [
  { to: "/", label: "Index" },
  { to: "/wedding", label: "Weddings" },
  { to: "/pre-wedding", label: "Pre-Wedding" },
  { to: "/cinematic", label: "Cinematic" },
  { to: "/contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => setOpen(false), [loc.pathname]);

  const isHome = loc.pathname === "/";
  const onDark = isHome && !scrolled;
  const brandColor = onDark ? "var(--cream)" : "var(--ink)";

  return (
    <>
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.1, delay: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
          scrolled
            ? "bg-[color:var(--cream)]/90 backdrop-blur-md border-b border-[color:var(--ink)]/10"
            : "bg-transparent"
        }`}
        data-testid="site-nav"
      >
        <div className="mx-auto max-w-[1500px] px-6 md:px-10 py-4 flex items-center justify-between">
          <Link to="/" data-testid="nav-logo" className="block" style={{ color: brandColor }}>
            <Logo className="h-9 md:h-11 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                data-testid={`nav-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                className={({ isActive }) =>
                  `text-[11px] uppercase tracking-[0.28em] font-semibold transition-colors ${
                    onDark ? "text-[color:var(--cream)]" : "text-[color:var(--ink)]"
                  } hover:text-[color:var(--copper)] ${isActive ? "text-[color:var(--copper)]" : ""}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <span className={`text-[10px] tracking-[0.28em] uppercase ${onDark ? "text-[color:var(--cream)]/80" : "text-[color:var(--ink)]/60"}`}>
              Sambhaji Nagar · IN
            </span>
          </div>

          <button
            className={`md:hidden ${onDark ? "text-[color:var(--cream)]" : "text-[color:var(--ink)]"}`}
            onClick={() => setOpen((s) => !s)}
            data-testid="nav-menu-toggle"
            aria-label="menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed top-[68px] left-0 right-0 z-40 bg-[color:var(--cream)] border-b border-[color:var(--ink)]/10 md:hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === "/"}
                  data-testid={`nav-mobile-${l.label.toLowerCase()}`}
                  className="font-serif italic text-3xl text-[color:var(--ink)]"
                >
                  {l.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
