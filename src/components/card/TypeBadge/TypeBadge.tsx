import type { TypeName } from "../types";
import { TYPE_CONFIG, TypeInnerShadow, TypeRadialGradient, GrassDropShadow } from "../type-config";
import svgPaths from "../../../../svg-2xxt8uep3y";
import "./TypeBadge.css";

export interface ITypeBadgeProps {
  className?: string;
  type?: TypeName;
}

/**
 * Pokémon energy-type badge. Renders a circular base with the type symbol
 * inside. Sizes to fill its container. Handles Grass (drop-shadow) and
 * Psychic (extra eyebrow) special cases.
 */
export function TypeBadge({ className, type = "Normal" }: ITypeBadgeProps) {
  const cfg = TYPE_CONFIG[type];
  const filterId = `type-${type}-innerShadow`;
  const gradientId = `type-${type}-gradient`;
  const grassShadowId = `type-${type}-grassShadow`;

  return (
    <div className={className ? `type ${className}` : "type"} data-type={type}>
      <div className="type__ring">
        <svg className="card__svgFill" fill="none" preserveAspectRatio="none" viewBox="0 0 41 41">
          <g>
            <g filter={`url(#${filterId})`}>
              <circle cx="20.5" cy="20.5" fill={cfg.baseFill} r="19" />
              <circle cx="20.5" cy="20.5" fill={`url(#${gradientId})`} r="19" />
            </g>
            <circle cx="20.5" cy="20.5" r="19.75" stroke="white" strokeWidth="1.5" />
          </g>
          <defs>
            <TypeInnerShadow id={filterId} />
            <TypeRadialGradient id={gradientId} cfg={cfg} />
          </defs>
        </svg>
      </div>
      {!cfg.isGrass && (
        <div className="type__symbol">
          <svg className="card__svgAbsFill" fill="none" preserveAspectRatio="none" viewBox={cfg.symbolViewBox}>
            <path d={cfg.symbolPath} fill="black" />
          </svg>
        </div>
      )}
      {cfg.isGrass && (
        <div className="type__symbol">
          <div className="type__symbolGrassShadow">
            <svg className="card__svgFill" fill="none" preserveAspectRatio="none" viewBox="0 0 38 41">
              <g filter={`url(#${grassShadowId})`}>
                <path d={cfg.symbolPath} fill="black" />
              </g>
              <defs>
                <GrassDropShadow id={grassShadowId} />
              </defs>
            </svg>
          </div>
        </div>
      )}
      {cfg.isPsychic && (
        <div className="type__psychicExtra">
          <svg className="card__svgAbsFill" fill="none" preserveAspectRatio="none" viewBox="0 0 32 24">
            <path clipRule="evenodd" d={svgPaths.p388629f0} fill="black" fillRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
}
