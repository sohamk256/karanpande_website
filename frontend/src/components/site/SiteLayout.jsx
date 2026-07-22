import { Outlet } from "react-router-dom";
import Nav from "./Nav";
import Footer from "./Footer";
import CustomCursor from "./CustomCursor";
import LenisProvider from "./LenisProvider";

export default function SiteLayout() {
  return (
    <LenisProvider>
      <div className="hide-cursor bg-[color:var(--cream)] text-[color:var(--ink)]">
        <CustomCursor />
        <div className="grain" aria-hidden />
        <Nav />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </LenisProvider>
  );
}
