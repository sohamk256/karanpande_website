import { motion } from "framer-motion";

/**
 * Masked line-by-line reveal. No jitter, no rotation — just a calm slide-up.
 */
export default function RevealHeading({ lines = [], className = "", delay = 0, style }) {
  return (
    <span className={className} style={style}>
      {lines.map((line, i) => (
        <span key={i} className="hero-mask">
          <motion.span
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 1.15, delay: delay + i * 0.14, ease: [0.22, 0.61, 0.36, 1] }}
            className="inline-block"
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
