import svgPaths from "../../../../svg-2xxt8uep3y";
import type { IRetreatCost, TypeName } from "../types";
import { TypeBadge } from "../TypeBadge/TypeBadge";
import "./BattleBar.css";

export interface IBattleBarProps {
  className?: string;
  weaknessType: TypeName;
  weaknessMultiplier: number;
  resistanceType?: TypeName;
  resistanceAmount?: number;
  retreatCost: IRetreatCost;
}

const RETREAT_POSITION_CLASSES = [
  "card__retreatCostType--first",
  "card__retreatCostType--second",
  "card__retreatCostType--third",
  "card__retreatCostType--fourth",
] as const;

/**
 * Battle bar — weakness / resistance / retreat cost row above the bottom strip.
 *
 * Renders the full metallic base (weakness half + retreat half) together with
 * the three text groups (weakness / resistance / retreat labels + values) and
 * the type badges. Resistance block is optional. Retreat cost renders zero
 * through four `<TypeBadge type="Normal" />` pips driven by `retreatCost`.
 *
 * The outer `.card__battleBar` positioning lives in BasicCard.css because
 * every child uses `position: absolute` with inset percentages relative to
 * the 733×1024 card artboard (the wrapper uses `display: contents`).
 */
export function BattleBar({
  className,
  weaknessType,
  weaknessMultiplier,
  resistanceType,
  resistanceAmount,
  retreatCost,
}: IBattleBarProps) {
  return (
    <div className={className ? `card__battleBar ${className}` : "card__battleBar"} data-name="Battle Bar">
      <div className={"card__retreat"} data-name="Retreat">
        <div className={"card__retreatBase"}>
          <div className={"card__retreatShadowWrap"}>
            <div className={"card__retreatShadow"}>
              <svg className={"card__svgFill"} fill="none" preserveAspectRatio="none" viewBox="0 0 296 37">
                <g filter="url(#filter0_d_1_639)">
                  <path d={svgPaths.p3064c000} fill="url(#paint0_linear_1_639)" />
                </g>
                <defs>
                  <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="37" id="filter0_d_1_639" width="296" x="0" y="0">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                    <feOffset dx="2" dy="2" />
                    <feGaussianBlur stdDeviation="1" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                    <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1_639" />
                    <feBlend in="SourceGraphic" in2="effect1_dropShadow_1_639" mode="normal" result="shape" />
                  </filter>
                  <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_639" x1="17.5" x2="17.5" y1="0" y2="33.8057">
                    <stop stopColor="#888D91" />
                    <stop offset="0.217589" stopColor="#969694" />
                    <stop offset="0.377254" stopColor="#F3F3F4" />
                    <stop offset="0.501698" stopColor="#707172" />
                    <stop offset="0.674328" stopColor="#545454" />
                    <stop offset="0.864352" stopColor="#C7C7C7" />
                    <stop offset="1" stopColor="#888A8B" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <div className={"card__retreatBar"}>
            <svg className={"card__svgAbsFill"} fill="none" preserveAspectRatio="none" viewBox="0 0 277.486 33">
              <path d={svgPaths.p39dd5680} fill="url(#paint0_linear_1_637)" />
              <defs>
                <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_637" x1="79.9884" x2="79.9884" y1="0" y2="33">
                  <stop stopColor="#FDFDFD" />
                  <stop offset="0.183929" stopColor="#D9DADA" />
                  <stop offset="0.329061" stopColor="white" />
                  <stop offset="0.580005" stopColor="white" />
                  <stop offset="0.750786" stopColor="#DFE0E1" />
                  <stop offset="0.900655" stopColor="#AEB1B3" />
                  <stop offset="1" stopColor="#E8E6E5" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className={"card__retreatBarCapEnd"}>
            <svg className={"card__svgAbsFill"} fill="none" preserveAspectRatio="none" viewBox="0 0 27 33">
              <path d={svgPaths.p158fa080} fill="url(#paint0_linear_1_507)" />
              <defs>
                <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_507" x1="13.5" x2="13.5" y1="0" y2="33.8057">
                  <stop stopColor="#888D91" />
                  <stop offset="0.217589" stopColor="#969694" />
                  <stop offset="0.377254" stopColor="#F3F3F4" />
                  <stop offset="0.501698" stopColor="#707172" />
                  <stop offset="0.674328" stopColor="#545454" />
                  <stop offset="0.864352" stopColor="#C7C7C7" />
                  <stop offset="1" stopColor="#888A8B" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className={"card__retreatBarCapStart"}>
            <svg className={"card__svgAbsFill"} fill="none" preserveAspectRatio="none" viewBox="0 0 35 33">
              <path d={svgPaths.p305bdc0} fill="url(#paint0_linear_1_607)" />
              <defs>
                <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_607" x1="17.5" x2="17.5" y1="0" y2="33.8057">
                  <stop stopColor="#888D91" />
                  <stop offset="0.217589" stopColor="#969694" />
                  <stop offset="0.377254" stopColor="#F3F3F4" />
                  <stop offset="0.501698" stopColor="#707172" />
                  <stop offset="0.674328" stopColor="#545454" />
                  <stop offset="0.864352" stopColor="#C7C7C7" />
                  <stop offset="1" stopColor="#888A8B" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <p className={"card__retreatLabel"}>retreat</p>
        </div>
      </div>

      <div className={"card__weaknessBase"}>
        <div className={"card__weaknessBaseShadow"}>
          <svg className={"card__svgFill"} fill="none" preserveAspectRatio="none" viewBox="0 0 414 37">
            <g filter="url(#filter0_d_1_583)">
              <path d={svgPaths.p7432c00} fill="url(#paint0_linear_1_583)" />
            </g>
            <path d={svgPaths.p1fad7d90} fill="url(#paint1_linear_1_583)" />
            <path d={svgPaths.p36b4b070} fill="url(#paint2_linear_1_583)" />
            <path d={svgPaths.p8f31730} fill="url(#paint3_linear_1_583)" />
            <path d={svgPaths.p305bdc0} fill="url(#paint4_linear_1_583)" />
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="37" id="filter0_d_1_583" width="414" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="2" dy="2" />
                <feGaussianBlur stdDeviation="1" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1_583" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_1_583" mode="normal" result="shape" />
              </filter>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_583" x1="17.5" x2="17.5" y1="0" y2="33.8057">
                <stop stopColor="#888D91" />
                <stop offset="0.217589" stopColor="#969694" />
                <stop offset="0.377254" stopColor="#F3F3F4" />
                <stop offset="0.501698" stopColor="#707172" />
                <stop offset="0.674328" stopColor="#545454" />
                <stop offset="0.864352" stopColor="#C7C7C7" />
                <stop offset="1" stopColor="#888A8B" />
              </linearGradient>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_1_583" x1="204.5" x2="204.5" y1="0" y2="33">
                <stop stopColor="#FDFDFD" />
                <stop offset="0.183929" stopColor="#D9DADA" />
                <stop offset="0.329061" stopColor="white" />
                <stop offset="0.580005" stopColor="white" />
                <stop offset="0.750786" stopColor="#DFE0E1" />
                <stop offset="0.900655" stopColor="#AEB1B3" />
                <stop offset="1" stopColor="#E8E6E5" />
              </linearGradient>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint2_linear_1_583" x1="197.25" x2="197.25" y1="3" y2="30.6592">
                <stop stopColor="#888D91" />
                <stop offset="0.0818818" stopColor="#969694" />
                <stop offset="0.317599" stopColor="#F3F3F4" />
                <stop offset="0.501698" stopColor="#707172" />
                <stop offset="0.674328" stopColor="#545454" />
                <stop offset="0.864352" stopColor="#C7C7C7" />
                <stop offset="1" stopColor="#888A8B" />
              </linearGradient>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint3_linear_1_583" x1="396.5" x2="396.5" y1="0" y2="33.8057">
                <stop stopColor="#888D91" />
                <stop offset="0.217589" stopColor="#969694" />
                <stop offset="0.377254" stopColor="#F3F3F4" />
                <stop offset="0.501698" stopColor="#707172" />
                <stop offset="0.674328" stopColor="#545454" />
                <stop offset="0.864352" stopColor="#C7C7C7" />
                <stop offset="1" stopColor="#888A8B" />
              </linearGradient>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint4_linear_1_583" x1="17.5" x2="17.5" y1="0" y2="33.8057">
                <stop stopColor="#888D91" />
                <stop offset="0.217589" stopColor="#969694" />
                <stop offset="0.377254" stopColor="#F3F3F4" />
                <stop offset="0.501698" stopColor="#707172" />
                <stop offset="0.674328" stopColor="#545454" />
                <stop offset="0.864352" stopColor="#C7C7C7" />
                <stop offset="1" stopColor="#888A8B" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {resistanceType && resistanceAmount !== undefined && (
        <div className="card__resistanceGroup" data-name="Resistance">
          <p className="card__battleText card__resistanceLabel">resistance</p>
          <p className="card__battleText card__resistanceMinus">-</p>
          <p className="card__battleText card__resistanceNum">{resistanceAmount}</p>
        </div>
      )}

      <div className="card__weaknessGroup" data-name="Weakness">
        <p className="card__battleText card__weaknessLabel">weakness</p>
        <p className="card__battleText card__weaknessMult">x</p>
        <p className="card__battleText card__weaknessNum">{weaknessMultiplier}</p>
      </div>

      <div className="card__retreatCost" data-name="Retreat Cost">
        {Array.from({ length: retreatCost }, (_, i) => (
          <TypeBadge
            key={i}
            className={`card__retreatCostType ${RETREAT_POSITION_CLASSES[i] ?? RETREAT_POSITION_CLASSES[0]}`}
            type="Normal"
          />
        ))}
      </div>

      {resistanceType && (
        <div className="card__resistanceType" data-name="Resistance Type">
          <TypeBadge type={resistanceType} />
        </div>
      )}

      <div className="card__weaknessType" data-name="Weakness Type">
        <TypeBadge type={weaknessType} />
      </div>
    </div>
  );
}
