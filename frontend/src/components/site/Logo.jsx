/**
 * Shutter Shots by KP — brand mark.
 * A hexagonal aperture inside a ticked lens ring with a crosshair —
 * a proper camera symbol, not a monogram.
 *
 * variant: "full" | "icon"
 */
export default function Logo({ variant = "full", className = "" }) {
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const rad = (i * 30 * Math.PI) / 180;
    const outer = 28;
    const inner = i % 3 === 0 ? 23.5 : 25.5;
    const w = i % 3 === 0 ? 1.1 : 0.65;
    const opacity = i % 3 === 0 ? 0.9 : 0.5;
    const cx = 32, cy = 32;
    return (
      <line
        key={i}
        x1={cx + Math.cos(rad) * outer}
        y1={cy + Math.sin(rad) * outer}
        x2={cx + Math.cos(rad) * inner}
        y2={cy + Math.sin(rad) * inner}
        stroke="currentColor"
        strokeWidth={w}
        opacity={opacity}
      />
    );
  });

  const badge = (
    <g transform="translate(2, 4)">
      {/* Outer ring */}
      <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="1.1" fill="none" />
      {ticks}
      {/* Six subtle aperture blades */}
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <path
          key={deg}
          d="M 32 32 L 32 14 A 18 18 0 0 1 47.588 23 Z"
          fill="currentColor"
          opacity="0.11"
          transform={`rotate(${deg} 32 32)`}
        />
      ))}
      {/* Inner hexagon */}
      <polygon
        points="32,14 47.588,23 47.588,41 32,50 16.412,41 16.412,23"
        stroke="currentColor"
        strokeWidth="0.85"
        fill="none"
        opacity="0.55"
      />
      {/* Crosshair */}
      <line x1="32" y1="24" x2="32" y2="40" stroke="currentColor" strokeWidth="0.7" opacity="0.7" />
      <line x1="24" y1="32" x2="40" y2="32" stroke="currentColor" strokeWidth="0.7" opacity="0.7" />
      {/* Center */}
      <circle cx="32" cy="32" r="2.6" fill="currentColor" />
    </g>
  );

  if (variant === "icon") {
    return (
      <svg viewBox="0 0 68 72" className={className} fill="none" aria-label="Shutter Shots by Karan Pande">
        {badge}
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 340 72" className={className} fill="none" aria-label="Shutter Shots by Karan Pande">
      {badge}

      {/* Divider hairline */}
      <line x1="86" y1="16" x2="86" y2="58" stroke="currentColor" strokeWidth="0.6" opacity="0.3" />

      {/* Wordmark */}
      <g transform="translate(100, 0)">
        <text
          x="0" y="38"
          fontFamily="'Cormorant Garamond', 'Times New Roman', serif"
          fontStyle="italic"
          fontWeight="500"
          fontSize="30"
          fill="currentColor"
          letterSpacing="0.4"
        >Shutter Shots</text>
        <text
          x="3" y="58"
          fontFamily="'Manrope', 'Helvetica Neue', sans-serif"
          fontSize="9"
          fill="currentColor"
          letterSpacing="2.6"
          fontWeight="600"
          opacity="0.75"
        >BY&#160;&#160;KARAN&#160;&#160;PANDE&#160;&#160;·&#160;&#160;PHOTOGRAPHY</text>
      </g>
    </svg>
  );
}
