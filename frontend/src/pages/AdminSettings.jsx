import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Save, LogOut, ExternalLink } from "lucide-react";
import { toast, Toaster } from "sonner";
import Logo from "../components/site/Logo";
import { fetchSettings, updateSettings, auth, verifyAdmin } from "../lib/api";
import { useSettings } from "../lib/settings";

const FIELDS = [
  { key: "hero_video_url", label: "Hero video URL (mp4)", full: true, placeholder: "https://…/hero.mp4" },
  { key: "hero_poster_url", label: "Hero poster / fallback image", full: true, placeholder: "https://…/poster.jpg" },
  { key: "hero_headline_1", label: "Hero — line 1", full: false, placeholder: "Weddings, held" },
  { key: "hero_headline_2", label: "Hero — line 2", full: false, placeholder: "like heirlooms." },
  { key: "hero_subtitle", label: "Hero subtitle", full: true, placeholder: "One sentence about the work…", textarea: true },
  { key: "about_photo_url", label: "About — photographer photo URL", full: true, placeholder: "https://…/karan.jpg" },
  { key: "about_bio_1", label: "About — bio paragraph 1", full: true, textarea: true, placeholder: "I photograph weddings…" },
  { key: "about_bio_2", label: "About — bio paragraph 2", full: true, textarea: true, placeholder: "My work sits somewhere between…" },
  { key: "phone", label: "Phone", full: false, placeholder: "+91 98765 43210" },
  { key: "whatsapp", label: "WhatsApp number", full: false, placeholder: "+91 98765 43210" },
  { key: "email", label: "Email", full: false, placeholder: "hello@karanpande.in" },
  { key: "instagram", label: "Instagram handle (no @)", full: false, placeholder: "karanpande" },
  { key: "location", label: "Studio location", full: true, placeholder: "Sambhaji Nagar, Maharashtra · India" },
];

export default function AdminSettings() {
  const nav = useNavigate();
  const { refresh } = useSettings();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const ok = await verifyAdmin();
      if (!ok) { nav("/admin/login"); return; }
      const s = await fetchSettings();
      setForm(s);
    })();
  }, [nav]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateSettings(form);
      setForm(updated);
      await refresh();
      toast.success("Settings saved");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const logout = () => { auth.clear(); nav("/admin/login"); };

  if (!form) {
    return (
      <div className="min-h-screen bg-[color:var(--cream)] flex items-center justify-center" data-testid="admin-settings-loading">
        <div className="eyebrow text-[color:var(--ink)]/50">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[color:var(--cream)]" data-testid="admin-settings">
      <Toaster richColors position="top-center" />

      <div className="border-b border-[color:var(--ink)]/10 bg-[color:var(--cream)]/95 backdrop-blur">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-5 flex items-center justify-between">
          <div className="flex items-baseline gap-6">
            <Link to="/" className="block text-[color:var(--ink)]">
              <Logo className="h-10 w-auto" />
            </Link>
            <span className="eyebrow text-[color:var(--copper)] hidden md:inline">Studio Panel</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin" className="btn-pill" data-testid="admin-back-media"><ArrowLeft size={12}/> Media library</Link>
            <Link to="/" target="_blank" className="btn-pill" data-testid="admin-view-site"><ExternalLink size={12}/> View site</Link>
            <button onClick={logout} className="btn-pill" data-testid="admin-settings-logout"><LogOut size={12}/> Logout</button>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
        className="mx-auto max-w-[1000px] px-6 md:px-10 py-14"
      >
        <div className="eyebrow">Site Settings</div>
        <h1 className="font-serif italic text-5xl md:text-6xl mt-2">The dressing room.</h1>
        <p className="mt-4 max-w-xl text-[color:var(--ink)]/70">
          Everything a visitor sees is set here — the hero video, headline lines,
          and every way they can reach you. Changes go live immediately.
        </p>

        <form onSubmit={submit} className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
          {FIELDS.map((f) => (
            <div key={f.key} className={f.full ? "md:col-span-2" : ""}>
              <label className="eyebrow block mb-2">{f.label}</label>
              {f.textarea ? (
                <textarea
                  rows={3}
                  value={form[f.key] || ""}
                  onChange={(e) => set(f.key, e.target.value)}
                  data-testid={`settings-${f.key}`}
                  placeholder={f.placeholder}
                  className="w-full border border-[color:var(--ink)]/15 bg-[color:var(--surface)] px-4 py-3 outline-none focus:border-[color:var(--copper)] font-sans text-sm"
                />
              ) : (
                <input
                  type="text"
                  value={form[f.key] || ""}
                  onChange={(e) => set(f.key, e.target.value)}
                  data-testid={`settings-${f.key}`}
                  placeholder={f.placeholder}
                  className="w-full border border-[color:var(--ink)]/15 bg-[color:var(--surface)] px-4 py-3 outline-none focus:border-[color:var(--copper)] font-sans text-sm"
                />
              )}
            </div>
          ))}

          {/* Live hero preview */}
          <div className="md:col-span-2 border-t border-[color:var(--ink)]/10 pt-8">
            <div className="eyebrow mb-3">Live preview</div>
            <div className="relative aspect-[21/9] overflow-hidden bg-[color:var(--ink)]">
              {form.hero_video_url ? (
                <video
                  key={form.hero_video_url}
                  className="w-full h-full object-cover"
                  src={form.hero_video_url}
                  poster={form.hero_poster_url}
                  autoPlay muted loop playsInline
                  data-testid="settings-hero-preview"
                />
              ) : (
                <img src={form.hero_poster_url} alt="poster" className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 video-scrim" />
              <div className="absolute bottom-6 left-6 right-6 text-[color:var(--cream)]">
                <div className="font-serif italic text-3xl md:text-5xl leading-[0.9]">
                  <div>{form.hero_headline_1 || "—"}</div>
                  <div>{form.hero_headline_2 || "—"}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 flex items-center gap-3 justify-end">
            <button
              type="button"
              onClick={async () => { const s = await fetchSettings(); setForm(s); toast.info("Reverted"); }}
              className="btn-pill"
              data-testid="settings-revert"
            >
              Revert
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-pill filled"
              data-testid="settings-save"
            >
              <Save size={12}/> {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
