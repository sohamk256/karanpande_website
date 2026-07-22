/**
 * Shutter Shots by KP — brand logo.
 * variant: "full" | "icon" | "mono"
 * color:   any CSS colour (defaults to currentColor)
 */
export default function Logo({ variant = "full", className = "", color = "currentColor" }) {
  const stroke = color;

  if (variant === "icon") {
    return (
      <svg viewBox="0 0 64 64" className={className} fill="none" aria-label="Shutter Shots by KP">
        <circle cx="32" cy="32" r="30" stroke={stroke} strokeWidth="1.2" />
        {/* aperture blades — 6 triangular slivers around center */}
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <path
            key={deg}
            d="M 32 32 L 32 6 A 26 26 0 0 1 54.516 19 Z"
            fill={stroke}
            opacity="0.14"
            transform={`rotate(${deg} 32 32)`}
          />
        ))}
        <polygon points="32,8 52,20 52,44 32,56 12,44 12,20" stroke={stroke} strokeWidth="0.9" fill="none" opacity="0.5" />
        <circle cx="32" cy="32" r="9.5" fill={stroke} />
        <text
          x="32" y="36" textAnchor="middle"
          fontFamily="'Cormorant Garamond', serif"
          fontStyle="italic" fontWeight="700"
          fontSize="12" fill="var(--cream)"
        >KP</text>
      </svg>
    );
  }

  // full
  return (
    <svg viewBox="0 0 300 64" className={className} fill="none" aria-label="Shutter Shots by KP">
      {/* Badge */}
      <g>
        <circle cx="32" cy="32" r="28" stroke={stroke} strokeWidth="1.1" />
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <path
            key={deg}
            d="M 32 32 L 32 8 A 24 24 0 0 1 52.784 20 Z"
            fill={stroke}
            opacity="0.13"
            transform={`rotate(${deg} 32 32)`}
          />
        ))}
        <polygon points="32,10 50,20 50,44 32,54 14,44 14,20" stroke={stroke} strokeWidth="0.85" fill="none" opacity="0.55" />
        <circle cx="32" cy="32" r="8.6" fill={stroke} />
        <text
          x="32" y="35.5" textAnchor="middle"
          fontFamily="'Cormorant Garamond', serif"
          fontStyle="italic" fontWeight="700"
          fontSize="11" fill="var(--cream)"
        >KP</text>
      </g>

      {/* Divider hairline */}
      <line x1="70" y1="14" x2="70" y2="50" stroke={stroke} strokeWidth="0.7" opacity="0.35" />

      {/* Wordmark */}
      <g transform="translate(82, 0)">
        <text
          x="0" y="30"
          fontFamily="'Cormorant Garamond', serif"
          fontStyle="italic" fontWeight="500"
          fontSize="26" fill={stroke}
          letterSpacing="0.3"
        >Shutter Shots</text>
        <text
          x="2" y="48"
          fontFamily="'Manrope', sans-serif"
          fontSize="8" fill={stroke}
          letterSpacing="5.2" opacity="0.72"
          fontWeight="600"
        >B Y &#8202; K A R A N &#8202; P A N D E</text>
      </g>
    </svg>
  );
}
