"use client";

import Image from "next/image";
import { useState } from "react";
import { Team } from "@/lib/mock-data";

type Size = "sm" | "md" | "lg" | "xl";

const sizes: Record<Size, { px: number; svgFontSize: number }> = {
  sm:  { px: 32,  svgFontSize: 7  },
  md:  { px: 44,  svgFontSize: 9  },
  lg:  { px: 60,  svgFontSize: 12 },
  xl:  { px: 80,  svgFontSize: 15 },
};

function FallbackBadge({ team, size }: { team: Team; size: Size }) {
  const { px, svgFontSize } = sizes[size];
  const { primary, secondary, text } = team.colors;
  const label = team.shortName.toUpperCase();

  const shieldPath = "M40 2 L76 14 L76 46 Q76 72 40 88 Q4 72 4 46 L4 14 Z";
  const innerPath  = "M40 8 L70 18 L70 46 Q70 68 40 82 Q10 68 10 46 L10 18 Z";

  return (
    <svg
      width={px}
      height={Math.round(px * 1.125)}
      viewBox="0 0 80 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.5))" }}
    >
      <path d={shieldPath} fill={secondary} />
      <path d={innerPath} fill={primary} />
      <clipPath id={`clip-${team.id}-fb`}><path d={innerPath} /></clipPath>
      <rect x="0" y="0" width="80" height="90" fill={secondary} opacity="0.15"
        clipPath={`url(#clip-${team.id}-fb)`} transform="rotate(-30 40 45)" />
      <text x="40" y="48" textAnchor="middle" dominantBaseline="middle"
        fill={text} fontWeight="900"
        fontFamily="'Inter','Arial',sans-serif"
        fontSize={svgFontSize} letterSpacing="2">
        {label}
      </text>
      <path d="M40 8 L70 18 L70 30 Q55 22 40 20 Q25 22 10 30 L10 18 Z"
        fill="white" opacity="0.1" clipPath={`url(#clip-${team.id}-fb)`} />
    </svg>
  );
}

export default function TeamBadge({ team, size = "md" }: { team: Team; size?: Size }) {
  const [error, setError] = useState(false);
  const { px } = sizes[size];

  if (!team.logoUrl || error) {
    return <FallbackBadge team={team} size={size} />;
  }

  return (
    <div
      style={{
        width: px,
        height: px,
        position: "relative",
        filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.4))",
        flexShrink: 0,
      }}
    >
      <Image
        src={team.logoUrl}
        alt={`Escudo ${team.name}`}
        fill
        sizes={`${px}px`}
        style={{ objectFit: "contain" }}
        onError={() => setError(true)}
        unoptimized
      />
    </div>
  );
}
