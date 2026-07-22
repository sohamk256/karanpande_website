import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 400, damping: 40, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 400, damping: 40, mass: 0.4 });
  const [label, setLabel] = useState("");
  const [big, setBig] = useState(false);
  const raf = useRef(null);

  useEffect(() => {
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e) => {
      const t = e.target.closest("[data-cursor]");
      if (t) {
        setLabel(t.dataset.cursor || "");
        setBig(true);
      } else if (e.target.closest("a,button,[role='button']")) {
        setLabel("");
        setBig(true);
      } else {
        setLabel("");
        setBig(false);
      }
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [x, y]);

  return (
    <motion.div
      className="cursor-dot pointer-events-none fixed left-0 top-0 z-[80] flex items-center justify-center"
      style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
    >
      <motion.div
        animate={{
          width: big ? 76 : 10,
          height: big ? 76 : 10,
          backgroundColor: big ? "#B87333" : "#1A1A18",
          color: "#F4F1EB",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="rounded-full flex items-center justify-center"
        style={{ fontFamily: "Manrope", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700 }}
      >
        {big && label ? label : null}
      </motion.div>
    </motion.div>
  );
}
