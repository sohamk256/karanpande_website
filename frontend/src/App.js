import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SiteLayout from "@/components/site/SiteLayout";
import Home from "@/pages/Home";
import GalleryPage from "@/pages/GalleryPage";
import CinematicPage from "@/pages/CinematicPage";
import Contact from "@/pages/Contact";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import { auth } from "@/lib/api";

function RequireAdmin({ children }) {
  if (!auth.isAuthed()) return <Navigate to="/admin/login" replace />;
  return children;
}

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public site with layout */}
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route
              path="/wedding"
              element={
                <GalleryPage
                  category="wedding"
                  title="Weddings"
                  chapter="Chapter 01"
                  subtitle="Ceremonies photographed like they're written — heirloom-warm, editorial in cut, honest in colour. Selections from mandaps, receptions and quiet in-between moments across India."
                  next={{ to: "/pre-wedding", title: "Pre-Wedding →" }}
                />
              }
            />
            <Route
              path="/pre-wedding"
              element={
                <GalleryPage
                  category="pre-wedding"
                  title="Pre-Wedding"
                  chapter="Chapter 02"
                  subtitle="Portraits made before the wedding day — in dunes, terraces, forests and old streets. Slow, cinematic, and rarely posed."
                  next={{ to: "/cinematic", title: "Cinematic →" }}
                />
              }
            />
            <Route path="/cinematic" element={<CinematicPage />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Admin (no site layout) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminDashboard />
              </RequireAdmin>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
