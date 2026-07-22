import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit3, LogOut, Image as ImageIcon, Film, ExternalLink } from "lucide-react";
import { toast, Toaster } from "sonner";
import {
  fetchAllMedia, createMedia, updateMedia, deleteMedia, auth, verifyAdmin,
} from "../lib/api";

const CATEGORIES = [
  { key: "wedding", label: "Wedding" },
  { key: "pre-wedding", label: "Pre-Wedding" },
  { key: "cinematic", label: "Cinematic" },
];

export default function AdminDashboard() {
  const nav = useNavigate();
  const [items, setItems] = useState([]);
  const [tab, setTab] = useState("wedding");
  const [modal, setModal] = useState(null); // { mode: "create"|"edit", item }

  useEffect(() => {
    (async () => {
      const ok = await verifyAdmin();
      if (!ok) { nav("/admin/login"); return; }
      load();
    })();
  }, []); // eslint-disable-line

  const load = async () => {
    try {
      const data = await fetchAllMedia();
      setItems(data);
    } catch { toast.error("Failed to load media"); }
  };

  const logout = () => { auth.clear(); nav("/admin/login"); };

  const filtered = items.filter((i) => i.category === tab);
  const counts = Object.fromEntries(CATEGORIES.map((c) => [c.key, items.filter((i) => i.category === c.key).length]));

  const onSave = async (payload, id) => {
    try {
      if (id) { await updateMedia(id, payload); toast.success("Updated"); }
      else { await createMedia(payload); toast.success("Added"); }
      setModal(null);
      load();
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Save failed");
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try { await deleteMedia(id); toast.success("Deleted"); load(); }
    catch { toast.error("Delete failed"); }
  };

  return (
    <div className="min-h-screen bg-[color:var(--cream)]" data-testid="admin-dashboard">
      <Toaster richColors position="top-center" />
      {/* Top bar */}
      <div className="border-b border-[color:var(--ink)]/10 bg-[color:var(--cream)]/95 backdrop-blur">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-5 flex items-center justify-between">
          <div className="flex items-baseline gap-6">
            <Link to="/" className="font-serif italic text-2xl">Karan · Pande</Link>
            <span className="eyebrow text-[color:var(--copper)] hidden md:inline">Studio Panel</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" target="_blank" className="btn-pill" data-testid="admin-view-site">
              View site <ExternalLink size={12} />
            </Link>
            <button onClick={logout} data-testid="admin-logout" className="btn-pill">
              Logout <LogOut size={12} />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="eyebrow">Overview</div>
            <h1 className="font-serif italic text-5xl md:text-6xl mt-2">Your library.</h1>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                onClick={() => setTab(c.key)}
                data-testid={`tab-${c.key}`}
                className={`text-left border p-4 transition-colors ${
                  tab === c.key
                    ? "border-[color:var(--copper)] bg-[color:var(--surface)]"
                    : "border-[color:var(--ink)]/10 hover:border-[color:var(--ink)]/30"
                }`}
              >
                <div className="text-[10px] tracking-[0.3em] uppercase text-[color:var(--ink)]/60">{c.label}</div>
                <div className="font-serif text-4xl mt-1">{counts[c.key] || 0}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between">
          <h2 className="font-serif text-3xl">{CATEGORIES.find(c => c.key === tab)?.label} — {filtered.length} items</h2>
          <button
            onClick={() => setModal({ mode: "create", item: { category: tab, kind: tab === "cinematic" ? "video" : "image", url: "", poster: "", title: "", caption: "", order: filtered.length + 1 } })}
            data-testid="add-media-btn"
            className="btn-pill filled"
          >
            <Plus size={14} /> Add {tab === "cinematic" ? "Video" : "Image"}
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((it) => (
            <motion.div
              key={it.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="border border-[color:var(--ink)]/10 bg-[color:var(--surface)] overflow-hidden"
              data-testid={`media-item-${it.id}`}
            >
              <div className="aspect-[4/3] bg-[color:var(--cream-2)] relative overflow-hidden">
                {it.kind === "video" ? (
                  <>
                    {it.poster ? <img src={it.poster} alt={it.title} className="w-full h-full object-cover"/> : null}
                    <div className="absolute top-3 left-3 bg-[color:var(--copper)] text-[color:var(--cream)] text-[10px] tracking-[0.2em] uppercase px-2 py-1 flex items-center gap-1"><Film size={12}/>Video</div>
                  </>
                ) : (
                  <>
                    <img src={it.url} alt={it.title} className="w-full h-full object-cover"/>
                    <div className="absolute top-3 left-3 bg-[color:var(--sage-deep)] text-[color:var(--cream)] text-[10px] tracking-[0.2em] uppercase px-2 py-1 flex items-center gap-1"><ImageIcon size={12}/>Image</div>
                  </>
                )}
              </div>
              <div className="p-4">
                <div className="font-serif text-xl truncate">{it.title || "Untitled"}</div>
                <div className="text-[10px] tracking-[0.3em] uppercase text-[color:var(--ink)]/50 mt-1">Order · {it.order}</div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setModal({ mode: "edit", item: it })}
                    data-testid={`edit-${it.id}`}
                    className="btn-pill flex-1 justify-center"
                    style={{ padding: "0.6rem 0.8rem" }}
                  >
                    <Edit3 size={12}/> Edit
                  </button>
                  <button
                    onClick={() => onDelete(it.id)}
                    data-testid={`delete-${it.id}`}
                    className="btn-pill flex-1 justify-center"
                    style={{ padding: "0.6rem 0.8rem", borderColor: "rgba(180,60,60,0.4)", color: "#a33" }}
                  >
                    <Trash2 size={12}/> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16 border border-dashed border-[color:var(--ink)]/20">
              <p className="font-serif text-2xl">No items yet.</p>
              <p className="text-sm text-[color:var(--ink)]/60 mt-2">Add your first {tab} media above.</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {modal && (
          <MediaModal
            initial={modal.item}
            mode={modal.mode}
            onCancel={() => setModal(null)}
            onSave={onSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function MediaModal({ initial, mode, onCancel, onSave }) {
  const [form, setForm] = useState({
    category: initial.category || "wedding",
    kind: initial.kind || "image",
    url: initial.url || "",
    poster: initial.poster || "",
    title: initial.title || "",
    caption: initial.caption || "",
    order: initial.order || 0,
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    onSave(form, mode === "edit" ? initial.id : null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[color:var(--ink)]/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onCancel}
      data-testid="media-modal"
    >
      <motion.form
        initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="w-full max-w-lg bg-[color:var(--surface)] p-8 border border-[color:var(--ink)]/10"
      >
        <div className="eyebrow text-[color:var(--copper)]">{mode === "edit" ? "Edit media" : "New media"}</div>
        <h3 className="font-serif italic text-3xl mt-1">{form.title || "Untitled item"}</h3>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <Field label="Category">
            <select value={form.category} onChange={(e) => set("category", e.target.value)} data-testid="modal-category" className="input">
              <option value="wedding">Wedding</option>
              <option value="pre-wedding">Pre-Wedding</option>
              <option value="cinematic">Cinematic</option>
            </select>
          </Field>
          <Field label="Kind">
            <select value={form.kind} onChange={(e) => set("kind", e.target.value)} data-testid="modal-kind" className="input">
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </Field>
          <Field label="Media URL" full>
            <input value={form.url} onChange={(e) => set("url", e.target.value)} required data-testid="modal-url" className="input" placeholder="https://…" />
          </Field>
          {form.kind === "video" && (
            <Field label="Poster (thumbnail URL)" full>
              <input value={form.poster} onChange={(e) => set("poster", e.target.value)} data-testid="modal-poster" className="input" placeholder="https://…" />
            </Field>
          )}
          <Field label="Title" full>
            <input value={form.title} onChange={(e) => set("title", e.target.value)} data-testid="modal-title" className="input" />
          </Field>
          <Field label="Caption" full>
            <input value={form.caption} onChange={(e) => set("caption", e.target.value)} data-testid="modal-caption" className="input" />
          </Field>
          <Field label="Order">
            <input type="number" value={form.order} onChange={(e) => set("order", parseInt(e.target.value || "0", 10))} data-testid="modal-order" className="input" />
          </Field>
        </div>

        <div className="mt-8 flex gap-3 justify-end">
          <button type="button" onClick={onCancel} data-testid="modal-cancel" className="btn-pill">Cancel</button>
          <button type="submit" data-testid="modal-save" className="btn-pill filled">Save</button>
        </div>

        <style>{`.input{width:100%;border:1px solid rgba(26,26,24,0.15);background:transparent;padding:0.6rem 0.8rem;outline:none;font-family:var(--font-sans);font-size:0.9rem}.input:focus{border-color:var(--copper)}`}</style>
      </motion.form>
    </motion.div>
  );
}

function Field({ label, full, children }) {
  return (
    <label className={full ? "col-span-2" : "col-span-1"}>
      <span className="eyebrow block mb-2">{label}</span>
      {children}
    </label>
  );
}
