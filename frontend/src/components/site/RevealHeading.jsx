import { motion } from "framer-motion";

/**
 * Renders text as a masked line-by-line reveal.
 * Pass array of strings (each string = 1 line).
 */
export default function RevealHeading({ lines = [], className = "", delay = 0, style }) {
  return (
    <span className={className} style={style}>
      {lines.map((line, i) => (
        <span key={i} className="hero-mask">
          <motion.span
            initial={{ y: "115%", rotate: 4 }}
            animate={{ y: "0%", rotate: 0 }}
            transition={{ duration: 1.05, delay: delay + i * 0.11, ease: [0.2, 0.8, 0.2, 1] }}
            className="inline-block"
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
