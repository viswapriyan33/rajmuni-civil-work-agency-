import React, { useState, useEffect } from 'react';

// Advanced 3D Floating Renovation Materials Component
export default function FloatingRenovationMaterials({ mousePos }) {
  // Parallax offsets based on mouse position
  const px = (mousePos.x / window.innerWidth - 0.5) * 40;
  const py = (mousePos.y / window.innerHeight - 0.5) * 40;

  const [activeTool, setActiveTool] = useState(null);

  return (
    <div className="floating-materials-scene">
      {/* 1. LADDER (Top Left) */}
      <div
        className={`floating-tool-item tool-ladder ${activeTool === 'ladder' ? 'tool-spinning' : ''}`}
        style={{
          transform: `translate3d(${px * 1.2}px, ${py * 1.2}px, 0)`,
        }}
        onClick={() => setActiveTool(activeTool === 'ladder' ? null : 'ladder')}
        title="Aluminum Renovation Ladder"
      >
        <svg viewBox="0 0 140 220" className="tool-svg">
          <defs>
            <linearGradient id="ladderMetal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f1f5f9" />
              <stop offset="50%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
            <linearGradient id="rungRed" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>
            <filter id="glowCyan" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#00d2ff" floodOpacity="0.4" />
            </filter>
          </defs>
          <g filter="url(#glowCyan)">
            {/* Left Stile */}
            <path d="M45 10 L20 210 L30 210 L55 10 Z" fill="url(#ladderMetal)" />
            {/* Right Stile */}
            <path d="M85 10 L110 210 L100 210 L75 10 Z" fill="url(#ladderMetal)" />
            {/* Top Cap */}
            <rect x="42" y="8" width="46" height="10" rx="3" fill="#cbd5e1" />
            {/* Red Rungs with 3D Depth */}
            <rect x="42" y="45" width="42" height="8" rx="2" fill="url(#rungRed)" />
            <rect x="36" y="85" width="54" height="8" rx="2" fill="url(#rungRed)" />
            <rect x="30" y="125" width="66" height="8" rx="2" fill="url(#rungRed)" />
            <rect x="24" y="165" width="78" height="8" rx="2" fill="url(#rungRed)" />
          </g>
        </svg>
        <span className="tool-label-tag">ALUMINUM LADDER // 2.4M</span>
      </div>

      {/* 2. POWER DRILL (Top Right) */}
      <div
        className={`floating-tool-item tool-drill ${activeTool === 'drill' ? 'tool-spinning' : ''}`}
        style={{
          transform: `translate3d(${-px * 1.5}px, ${py * 0.9}px, 0)`,
        }}
        onClick={() => setActiveTool(activeTool === 'drill' ? null : 'drill')}
        title="Impact Power Drill"
      >
        <svg viewBox="0 0 200 160" className="tool-svg">
          <defs>
            <linearGradient id="drillYellow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="60%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#92400e" />
            </linearGradient>
            <linearGradient id="drillBlack" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="drillBit" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="50%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
          </defs>
          <g filter="url(#glowCyan)">
            {/* Drill Chuck & Bit */}
            <rect x="15" y="58" width="45" height="5" fill="url(#drillBit)" />
            <polygon points="12,60 16,57 16,63" fill="#cbd5e1" />
            <rect x="55" y="48" width="22" height="25" rx="3" fill="#475569" />
            <rect x="73" y="52" width="10" height="17" fill="#1e293b" />

            {/* Drill Main Body */}
            <path
              d="M80 40 L165 40 Q175 40 175 52 L175 80 Q175 92 162 92 L140 92 L135 140 Q135 150 120 150 L95 150 Q85 150 88 138 L95 92 L80 92 Q72 82 72 65 Q72 40 80 40 Z"
              fill="url(#drillYellow)"
            />

            {/* Rubber Grip & Battery Plate */}
            <path d="M102 96 L96 138 Q95 146 105 146 L125 146 Q130 146 130 138 L134 96 Z" fill="url(#drillBlack)" />
            {/* Trigger Switch */}
            <rect x="88" y="70" width="7" height="14" rx="2" fill="#ef4444" />
            {/* Ventilation Vents */}
            <rect x="135" y="50" width="25" height="3" rx="1.5" fill="#1e293b" />
            <rect x="135" y="56" width="25" height="3" rx="1.5" fill="#1e293b" />
            <rect x="135" y="62" width="25" height="3" rx="1.5" fill="#1e293b" />
          </g>
        </svg>
        <span className="tool-label-tag">POWER DRILL // 850W</span>
      </div>

      {/* 3. PAINT BUCKET & BRUSH (Middle Left) */}
      <div
        className={`floating-tool-item tool-bucket ${activeTool === 'bucket' ? 'tool-spinning' : ''}`}
        style={{
          transform: `translate3d(${px * 1.8}px, ${-py * 1.1}px, 0)`,
        }}
        onClick={() => setActiveTool(activeTool === 'bucket' ? null : 'bucket')}
        title="Renovation Paint Bucket"
      >
        <svg viewBox="0 0 160 160" className="tool-svg">
          <defs>
            <linearGradient id="bucketSilver" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="40%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>
            <linearGradient id="paintRed" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#991b1b" />
            </linearGradient>
          </defs>
          <g filter="url(#glowCyan)">
            {/* Bucket Body */}
            <path d="M35 55 L45 135 Q46 145 80 145 Q114 145 115 135 L125 55 Z" fill="url(#paintRed)" />
            {/* Bucket Rim */}
            <ellipse cx="80" cy="55" rx="45" ry="12" fill="url(#bucketSilver)" />
            {/* Paint Level inside */}
            <ellipse cx="80" cy="56" rx="41" ry="9" fill="#dc2626" />
            {/* Paint Drip on Edge */}
            <path d="M50 55 Q50 85 55 85 Q60 85 60 55 Z" fill="#ef4444" />
            {/* Metal Handle Wire */}
            <path d="M35 55 Q80 15 125 55" fill="none" stroke="#e2e8f0" strokeWidth="4" />
            {/* Brush Resting Across */}
            <rect x="25" y="42" width="95" height="10" rx="3" transform="rotate(-18 80 45)" fill="#eab308" />
            <rect x="90" y="42" width="35" height="10" rx="2" transform="rotate(-18 80 45)" fill="#64748b" />
            <path d="M118 42 L138 35 L138 48 Z" fill="#f87171" transform="rotate(-18 80 45)" />
          </g>
        </svg>
        <span className="tool-label-tag">ACRYLIC COATING // RED</span>
      </div>

      {/* 4. PAINT ROLLER & TRAY (Middle Right) */}
      <div
        className={`floating-tool-item tool-roller ${activeTool === 'roller' ? 'tool-spinning' : ''}`}
        style={{
          transform: `translate3d(${-px * 1.6}px, ${-py * 1.3}px, 0)`,
        }}
        onClick={() => setActiveTool(activeTool === 'roller' ? null : 'roller')}
        title="Paint Roller & Tray"
      >
        <svg viewBox="0 0 170 140" className="tool-svg">
          <defs>
            <linearGradient id="trayYellow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            <linearGradient id="rollerCylinder" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#fee2e2" />
              <stop offset="100%" stopColor="#f87171" />
            </linearGradient>
          </defs>
          <g filter="url(#glowCyan)">
            {/* Paint Tray */}
            <polygon points="35,60 145,50 155,115 25,125" fill="url(#trayYellow)" />
            <polygon points="45,68 135,60 145,110 35,118" fill="#d97706" />

            {/* Roller Metal Rod */}
            <path d="M50 45 L95 45 L95 25 L135 25" fill="none" stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round" />
            {/* Roller Handle */}
            <rect x="25" y="41" width="30" height="9" rx="3" fill="#ef4444" />
            {/* Roller Head */}
            <rect x="100" y="14" width="55" height="22" rx="6" fill="url(#rollerCylinder)" stroke="#fca5a5" strokeWidth="1" />
          </g>
        </svg>
        <span className="tool-label-tag">SURFACE ROLLER // 9"</span>
      </div>

      {/* 5. SPIRIT LEVEL (Bottom Center-Left) */}
      <div
        className={`floating-tool-item tool-level ${activeTool === 'level' ? 'tool-spinning' : ''}`}
        style={{
          transform: `translate3d(${px * 0.9}px, ${-py * 0.8}px, 0)`,
        }}
        onClick={() => setActiveTool(activeTool === 'level' ? null : 'level')}
        title="Precision Spirit Level"
      >
        <svg viewBox="0 0 240 60" className="tool-svg">
          <defs>
            <linearGradient id="levelYellow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
          </defs>
          <g filter="url(#glowCyan)">
            {/* Aluminum Bar */}
            <rect x="10" y="15" width="220" height="30" rx="6" fill="url(#levelYellow)" stroke="#a16207" strokeWidth="1.5" />
            {/* Rubber End Caps */}
            <rect x="10" y="15" width="16" height="30" rx="4" fill="#0f172a" />
            <rect x="214" y="15" width="16" height="30" rx="4" fill="#0f172a" />
            {/* Center Bubble Vial */}
            <rect x="95" y="21" width="50" height="18" rx="9" fill="#0f172a" />
            <rect x="100" y="24" width="40" height="12" rx="6" fill="#00d2ff" />
            <circle cx="120" cy="30" r="4" fill="#ffffff" />
            {/* Secondary Vial */}
            <circle cx="55" cy="30" r="9" fill="#0f172a" />
            <circle cx="55" cy="30" r="6" fill="#00d2ff" />
            <circle cx="185" cy="30" r="9" fill="#0f172a" />
            <circle cx="185" cy="30" r="6" fill="#00d2ff" />
          </g>
        </svg>
        <span className="tool-label-tag">SPIRIT LEVEL // 0.0° TOLERANCE</span>
      </div>

      {/* 6. MEASURING TAPE (Bottom Left) */}
      <div
        className={`floating-tool-item tool-tape ${activeTool === 'tape' ? 'tool-spinning' : ''}`}
        style={{
          transform: `translate3d(${px * 1.4}px, ${py * 1.5}px, 0)`,
        }}
        onClick={() => setActiveTool(activeTool === 'tape' ? null : 'tape')}
        title="Contractor Measuring Tape"
      >
        <svg viewBox="0 0 140 130" className="tool-svg">
          <defs>
            <linearGradient id="tapeYellow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
          </defs>
          <g filter="url(#glowCyan)">
            {/* Extended Steel Tape */}
            <rect x="5" y="75" width="45" height="8" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
            <line x1="12" y1="75" x2="12" y2="79" stroke="#000" strokeWidth="1" />
            <line x1="20" y1="75" x2="20" y2="81" stroke="#000" strokeWidth="1" />
            <line x1="28" y1="75" x2="28" y2="79" stroke="#000" strokeWidth="1" />
            <line x1="36" y1="75" x2="36" y2="82" stroke="#000" strokeWidth="1" />
            {/* Hook */}
            <path d="M5 75 L5 87 L9 87" fill="none" stroke="#475569" strokeWidth="3" />
            {/* Main Round Body */}
            <rect x="42" y="32" width="70" height="70" rx="20" fill="url(#tapeYellow)" />
            <rect x="42" y="32" width="70" height="70" rx="20" fill="none" stroke="#0f172a" strokeWidth="6" />
            {/* Black Center Hub */}
            <circle cx="77" cy="67" r="16" fill="#0f172a" />
            <circle cx="77" cy="67" r="7" fill="#facc15" />
            {/* Lock Switch */}
            <rect x="54" y="23" width="14" height="12" rx="2" fill="#ef4444" />
          </g>
        </svg>
        <span className="tool-label-tag">TAPE MEASURE // 5.0M</span>
      </div>

      {/* 7. HEAVY DUTY TOOLBOX (Bottom Right) */}
      <div
        className={`floating-tool-item tool-box ${activeTool === 'box' ? 'tool-spinning' : ''}`}
        style={{
          transform: `translate3d(${-px * 1.3}px, ${py * 1.4}px, 0)`,
        }}
        onClick={() => setActiveTool(activeTool === 'box' ? null : 'box')}
        title="Contractor Toolbox"
      >
        <svg viewBox="0 0 170 140" className="tool-svg">
          <defs>
            <linearGradient id="boxOrange" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="boxDark" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>
          <g filter="url(#glowCyan)">
            {/* Main Base */}
            <rect x="25" y="60" width="120" height="60" rx="8" fill="url(#boxDark)" stroke="#334155" strokeWidth="2" />
            {/* Lid */}
            <rect x="20" y="42" width="130" height="24" rx="6" fill="url(#boxOrange)" stroke="#b45309" strokeWidth="2" />
            {/* Top Handle */}
            <path d="M60 42 L60 25 Q60 20 65 20 L105 20 Q110 20 110 25 L110 42" fill="none" stroke="#1e293b" strokeWidth="7" strokeLinecap="round" />
            {/* Latches */}
            <rect x="50" y="58" width="14" height="16" rx="2" fill="#94a3b8" />
            <rect x="106" y="58" width="14" height="16" rx="2" fill="#94a3b8" />
          </g>
        </svg>
        <span className="tool-label-tag">CIVIL TOOLBOX // HEAVY DUTY</span>
      </div>

      {/* 8. CLAW HAMMER (Top Center-Right) */}
      <div
        className={`floating-tool-item tool-hammer ${activeTool === 'hammer' ? 'tool-spinning' : ''}`}
        style={{
          transform: `translate3d(${-px * 0.8}px, ${-py * 1.7}px, 0)`,
        }}
        onClick={() => setActiveTool(activeTool === 'hammer' ? null : 'hammer')}
        title="Construction Claw Hammer"
      >
        <svg viewBox="0 0 160 140" className="tool-svg">
          <defs>
            <linearGradient id="hammerSteel" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f1f5f9" />
              <stop offset="50%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
            <linearGradient id="handleYellow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
          </defs>
          <g filter="url(#glowCyan)" transform="rotate(35 80 70)">
            {/* Handle */}
            <rect x="73" y="45" width="14" height="85" rx="5" fill="url(#handleYellow)" />
            <rect x="71" y="90" width="18" height="40" rx="4" fill="#0f172a" />
            {/* Steel Head */}
            <path d="M40 32 L110 32 Q125 32 122 45 L115 48 L40 48 Z" fill="url(#hammerSteel)" />
            {/* Claw */}
            <path d="M40 32 Q15 36 20 60 Q28 42 40 48 Z" fill="url(#hammerSteel)" />
            {/* Striking Face */}
            <rect x="115" y="30" width="10" height="20" rx="2" fill="#cbd5e1" />
          </g>
        </svg>
        <span className="tool-label-tag">CLAW HAMMER // 20 OZ</span>
      </div>

      {/* 9. SPATULA / PUTTY KNIFE (Center-Left) */}
      <div
        className={`floating-tool-item tool-spatula ${activeTool === 'spatula' ? 'tool-spinning' : ''}`}
        style={{
          transform: `translate3d(${px * 1.5}px, ${py * 0.4}px, 0)`,
        }}
        onClick={() => setActiveTool(activeTool === 'spatula' ? null : 'spatula')}
        title="Joint Spatula / Putty Knife"
      >
        <svg viewBox="0 0 130 130" className="tool-svg">
          <g filter="url(#glowCyan)" transform="rotate(-25 65 65)">
            {/* Flexible Steel Blade */}
            <polygon points="35,20 95,20 85,70 45,70" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
            {/* Handle */}
            <rect x="55" y="70" width="20" height="45" rx="4" fill="#0f172a" />
            <circle cx="65" cy="105" r="3" fill="#cbd5e1" />
          </g>
        </svg>
        <span className="tool-label-tag">PUTTY SPATULA // 4"</span>
      </div>

      {/* 10. ARCHITECTURAL CAD BLUEPRINT SHEET (Floating Background Top-Center) */}
      <div
        className="floating-tool-item tool-cad-blueprint"
        style={{
          transform: `translate3d(${-px * 0.5}px, ${-py * 0.5}px, 0)`,
        }}
      >
        <svg viewBox="0 0 320 220" className="tool-svg-cad">
          <rect x="5" y="5" width="310" height="210" rx="10" fill="rgba(0, 86, 145, 0.4)" stroke="#00d2ff" strokeWidth="1.5" strokeDasharray="5,5" />
          {/* Blueprint Grid Lines */}
          <line x1="20" y1="40" x2="300" y2="40" stroke="rgba(0, 210, 255, 0.2)" />
          <line x1="20" y1="80" x2="300" y2="80" stroke="rgba(0, 210, 255, 0.2)" />
          <line x1="20" y1="120" x2="300" y2="120" stroke="rgba(0, 210, 255, 0.2)" />
          <line x1="20" y1="160" x2="300" y2="160" stroke="rgba(0, 210, 255, 0.2)" />

          <line x1="60" y1="20" x2="60" y2="200" stroke="rgba(0, 210, 255, 0.2)" />
          <line x1="120" y1="20" x2="120" y2="200" stroke="rgba(0, 210, 255, 0.2)" />
          <line x1="180" y1="20" x2="180" y2="200" stroke="rgba(0, 210, 255, 0.2)" />
          <line x1="240" y1="20" x2="240" y2="200" stroke="rgba(0, 210, 255, 0.2)" />

          {/* Floor Plan Walls */}
          <rect x="35" y="30" width="130" height="150" fill="none" stroke="#00d2ff" strokeWidth="2.5" />
          <rect x="165" y="30" width="115" height="85" fill="none" stroke="#00d2ff" strokeWidth="2.5" />
          <rect x="165" y="115" width="115" height="65" fill="none" stroke="#00d2ff" strokeWidth="2.5" />
          {/* Doors & Dimensions */}
          <path d="M80 30 Q100 30 100 50" fill="none" stroke="#f6c854" strokeWidth="1.5" strokeDasharray="2,2" />
          <text x="50" y="110" fill="#00d2ff" fontSize="10" fontFamily="JetBrains Mono">GREAT ROOM 24'x18'</text>
          <text x="180" y="75" fill="#00d2ff" fontSize="9" fontFamily="JetBrains Mono">MASTER SUITE</text>
          <text x="180" y="150" fill="#00d2ff" fontSize="9" fontFamily="JetBrains Mono">KITCHEN</text>
        </svg>
        <span className="tool-label-tag">CAD ARCHITECTURAL BLUEPRINT // REV B</span>
      </div>
    </div>
  );
}
