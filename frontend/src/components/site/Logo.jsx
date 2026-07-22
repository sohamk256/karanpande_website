/**
 * Shutter Shots by KP — brand mark.
 * Now drawn as a stylised rangefinder camera silhouette
 * with an aperture-blade lens.
 *
 * variant: "full" | "icon"
 */
export default function Logo({ variant = "full", className = "" }) {
  // Aperture blades inside the lens
  const blades = [0, 60, 120, 180, 240, 300].map((deg) => (
    <path
      key={deg}
      d="M 36 38 L 36 27 A 11 11 0 0 1 45.526 32.5 Z"
      fill="currentColor"
      opacity="0.15"
      transform={`rotate(${deg} 36 38)`}
    />
  ));

  const camera = (
    <g>
      {/* Camera body */}
      <rect
        x="4" y="16" width="64" height="42" rx="3.5" ry="3.5"
        stroke="currentColor" strokeWidth="1.2" fill="none"
      />

      {/* Viewfinder / pentaprism bump */}
      <path
        d="M 22 16 L 26 8 L 46 8 L 50 16 Z"
        stroke="currentColor" strokeWidth="1.2" fill="none"
        strokeLinejoin="round"
      />

      {/* Shutter button (top-left) */}
      <circle cx="14" cy="12" r="2" fill="currentColor" />
      <circle cx="14" cy="12" r="3.2" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.55" />

      {/* Top dial (top-right) */}
      <rect
        x="55" y="10" width="8" height="4" rx="1" ry="1"
        stroke="currentColor" strokeWidth="0.7" fill="none" opacity="0.7"
      />

      {/* Rangefinder mini window (right of viewfinder) */}
      <rect
        x="52" y="22" width="8" height="5" rx="0.6" ry="0.6"
        stroke="currentColor" strokeWidth="0.7" fill="none" opacity="0.6"
      />

      {/* Grip lines */}
      <line x1="10" y1="46" x2="10" y2="52" stroke="currentColor" strokeWidth="0.65" opacity="0.55" />
      <line x1="12.5" y1="46" x2="12.5" y2="52" stroke="currentColor" strokeWidth="0.65" opacity="0.55" />
      <line x1="15" y1="46" x2="15" y2="52" stroke="currentColor" strokeWidth="0.65" opacity="0.55" />

      {/* Lens — outer ring */}
      <circle cx="36" cy="38" r="14" stroke="currentColor" strokeWidth="1.1" fill="none" />
      {/* Lens — inner ring */}
      <circle cx="36" cy="38" r="11" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.5" />
      {/* Aperture blades */}
      {blades}
      {/* Inner hexagon (aperture opening) */}
      <polygon
        points="36,28 44.66,33 44.66,43 36,48 27.34,43 27.34,33"
        stroke="currentColor" strokeWidth="0.75" fill="none" opacity="0.6"
      />
      {/* Crosshair */}
      <line x1="36" y1="32" x2="36" y2="44" stroke="currentColor" strokeWidth="0.55" opacity="0.55" />
      <line x1="30" y1="38" x2="42" y2="38" stroke="currentColor" strokeWidth="0.55" opacity="0.55" />
      {/* Center dot (shutter) */}
      <circle cx="36" cy="38" r="2" fill="currentColor" />
    </g>
  );

  if (variant === "icon") {
    return (
      <svg viewBox="0 0 72 64" className={className} fill="none" aria-label="Shutter Shots by Karan Pande">
        {camera}
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 360 72" className={className} fill="none" aria-label="Shutter Shots by Karan Pande">
      {camera}

      {/* Divider hairline */}
      <line x1="92" y1="16" x2="92" y2="58" stroke="currentColor" strokeWidth="0.6" opacity="0.3" />

      {/* Wordmark */}
      <g transform="translate(106, 0)">
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
