import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SiteLayout from "@/components/site/SiteLayout";
import Home from "@/pages/Home";
import GalleryPage from "@/pages/GalleryPage";
import AlbumPage from "@/pages/AlbumPage";
import Contact from "@/pages/Contact";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminSettings from "@/pages/AdminSettings";
import { auth } from "@/lib/api";
import { SettingsProvider } from "@/lib/settings";

function RequireAdmin({ children }) {
  if (!auth.isAuthed()) return <Navigate to="/admin/login" replace />;
  return children;
}

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <SettingsProvider>
          <Routes>
            <Route element={<SiteLayout />}>
              <Route path="/" element={<Home />} />

              <Route
                path="/wedding"
                element={
                  <GalleryPage
                    category="wedding"
                    title="Weddings"
                    chapter="Chapter 01"
                    subtitle="Every wedding is a folder of its own — ceremonies, receptions, and the quiet in-betweens of two families. Open any album to see the story in full."
                    next={{ to: "/pre-wedding", title: "Pre-Wedding →" }}
                  />
                }
              />
              <Route path="/wedding/:slug" element={<AlbumPage category="wedding" />} />

              <Route
                path="/pre-wedding"
                element={
                  <GalleryPage
                    category="pre-wedding"
                    title="Pre-Wedding"
                    chapter="Chapter 02"
                    subtitle="Story shoots made before the wedding day — on dunes, terraces, forests, and old streets. Slow, cinematic, and rarely posed."
                    next={{ to: "/cinematic", title: "Cinematic →" }}
                  />
                }
              />
              <Route path="/pre-wedding/:slug" element={<AlbumPage category="pre-wedding" />} />

              <Route
                path="/cinematic"
                element={
                  <GalleryPage
                    category="cinematic"
                    title="Cinematic"
                    chapter="Chapter 03"
                    subtitle="Feature-length wedding films, teasers and reels — cut to feel like short cinema. Music, breath, silence."
                  />
                }
              />
              <Route path="/cinematic/:slug" element={<AlbumPage category="cinematic" />} />

              <Route path="/contact" element={<Contact />} />
            </Route>

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
            <Route path="/admin/settings" element={<RequireAdmin><AdminSettings /></RequireAdmin>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SettingsProvider>
      </BrowserRouter>
    </div>
  );
}
