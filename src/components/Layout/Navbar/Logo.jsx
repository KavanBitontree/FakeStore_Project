export default function Logo() {
  return (
    <div className="logo-content">
      {/* Logo SVG */}
      <svg
        viewBox="0 0 280 280"
        className="logo-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter
            id="boldShadow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feDropShadow
              dx="0"
              dy="4"
              stdDeviation="10"
              floodOpacity="0.3"
              floodColor="#ff4422"
            />
          </filter>
        </defs>

        <rect
          x="20"
          y="20"
          width="240"
          height="240"
          rx="28"
          fill="none"
          stroke="#ff3311"
          strokeWidth="6"
          strokeDasharray="12, 10"
          opacity="1"
          filter="url(#boldShadow)"
        />

        <g transform="translate(140, 140)">
          {/* Basket body - thick bold lines */}
          <path
            d="M -48 0 L -52 32 Q -52 48 -36 48 L 36 48 Q 52 48 52 32 L 48 0"
            fill="none"
            stroke="#ff3311"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#boldShadow)"
            opacity="1"
          />

          {/* Top rim - bold and prominent */}
          <path
            d="M -48 0 L -58 -18 L -28 -32 Q -16 -36 0 -36 L 16 -36 Q 32 -36 44 -28 L 58 0"
            fill="none"
            stroke="#ff3311"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#boldShadow)"
            opacity="1"
          />

          {/* Premium handles - bold curves */}
          <path
            d="M -24 -32 Q -32 -68 0 -72 Q 32 -68 24 -32"
            fill="none"
            stroke="#ff3311"
            strokeWidth="8"
            strokeLinecap="round"
            filter="url(#boldShadow)"
            opacity="1"
          />

          {/* Decorative grid pattern inside - adds premium feel */}
          <g opacity="0.8">
            <line
              x1="-28"
              y1="8"
              x2="28"
              y2="8"
              stroke="#ff3311"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <line
              x1="-28"
              y1="20"
              x2="28"
              y2="20"
              stroke="#ff3311"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>

          {/* Bold star accent - modern touch */}
          <g transform="translate(0, 20)" opacity="1">
            <circle cx="0" cy="0" r="5" fill="#ff3311" />
            <path
              d="M 0 -12 L 3 -2 L 13 -2 L 5 4 L 8 14 L 0 8 L -8 14 L -5 4 L -13 -2 L -3 -2 Z"
              fill="#ff3311"
            />
          </g>
        </g>
      </svg>

      <div className="logo-text">
        <h1 className="logo-title">
          Fake<span className="logo-highlight">Store</span>
        </h1>
      </div>
    </div>
  );
}
