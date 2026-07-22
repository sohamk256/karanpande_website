import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function FadeUp({ children, delay = 0, y = 40, className = "", once = true }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, amount: 0.2 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.2, 0.8, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
