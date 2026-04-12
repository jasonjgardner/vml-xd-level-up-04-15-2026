import type { TypeName } from "../types";
import { TYPE_CONFIG } from "../type-config";
import "./HpBadge.css";

export interface IHpBadgeProps {
  className?: string;
  type?: TypeName;
}

/**
 * HP badge — 57px dark circle with white ring and an inset type symbol.
 * Sits top-right of the card next to the "HP {value}" text (rendered by NameHeader).
 */
export function HpBadge({ className, type = "Normal" }: IHpBadgeProps) {
  const cfg = TYPE_CONFIG[type];
  return (
    <div className={className ? `card__hpBadge ${className}` : "card__hpBadge"} data-name="Pokemon Type">
      <div className="card__hpBadgeBase">
        <svg className="card__svgFill" fill="none" preserveAspectRatio="none" viewBox="0 0 57 57">
          <g>
            <g filter="url(#filter0_i_hp)">
              <circle cx="28.5" cy="28.5" fill={cfg.baseFill} r="24.5" />
              <circle cx="28.5" cy="28.5" fill="url(#paint0_radial_hp)" r="24.5" />
            </g>
            <circle cx="28.5" cy="28.5" r="26.5" stroke="white" strokeWidth="4" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="57" id="filter0_i_hp" width="57" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feMorphology in="SourceAlpha" operator="erode" radius="2" result="effect" />
              <feOffset />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" />
              <feBlend in2="shape" mode="overlay" result="effect" />
            </filter>
            <radialGradient cx="0" cy="0" gradientTransform="translate(23.9868 23.3421) rotate(48.3665) scale(31.0546)" gradientUnits="userSpaceOnUse" id="paint0_radial_hp" r="1">
              {cfg.stops.map((stop, i) => (
                <stop key={i} offset={stop.offset} stopColor={stop.color} stopOpacity={stop.opacity} />
              ))}
            </radialGradient>
          </defs>
        </svg>
      </div>
      <div className="card__hpBadgeSymbol" style={{ inset: "10.53% 15.81%", position: "absolute" }}>
        <svg className="card__svgAbsFill" fill="none" preserveAspectRatio="none" viewBox={cfg.symbolViewBox}>
          <path d={cfg.symbolPath} fill="black" />
        </svg>
      </div>
    </div>
  );
}
