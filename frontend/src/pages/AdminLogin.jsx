import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { login } from "../lib/api";
import { toast, Toaster } from "sonner";

export default function AdminLogin() {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(u, p);
      toast.success("Welcome back, Karan.");
      nav("/admin");
    } catch (err) {
      toast.error("Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[color:var(--cream)] flex items-center justify-center px-6" data-testid="admin-login">
      <Toaster richColors position="top-center" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        className="w-full max-w-md bg-[color:var(--surface)] border border-[color:var(--ink)]/10 p-10"
      >
        <div className="eyebrow text-[color:var(--copper)]">Studio Access</div>
        <h1 className="font-serif italic text-5xl mt-3">Sign in.</h1>
        <p className="mt-3 text-sm text-[color:var(--ink)]/60">Karan Pande Photography — admin panel.</p>

        <form onSubmit={submit} className="mt-10 space-y-5">
          <div>
            <label className="eyebrow block mb-2">Username</label>
            <input
              type="text"
              value={u}
              onChange={(e) => setU(e.target.value)}
              required
              autoComplete="username"
              data-testid="login-username"
              className="w-full border border-[color:var(--ink)]/15 bg-transparent px-4 py-3 focus:border-[color:var(--copper)] outline-none font-sans"
            />
          </div>
          <div>
            <label className="eyebrow block mb-2">Password</label>
            <input
              type="password"
              value={p}
              onChange={(e) => setP(e.target.value)}
              required
              autoComplete="current-password"
              data-testid="login-password"
              className="w-full border border-[color:var(--ink)]/15 bg-transparent px-4 py-3 focus:border-[color:var(--copper)] outline-none font-sans"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            data-testid="login-submit"
            className="btn-pill filled w-full justify-center disabled:opacity-60"
          >
            {loading ? "Signing in…" : (<>Sign in <LogIn size={14} /></>)}
          </button>
        </form>

        <div className="mt-8 text-[10px] tracking-[0.3em] uppercase text-[color:var(--ink)]/50">
          For studio only · Visitors need not sign in
        </div>
      </motion.div>
    </div>
  );
}
