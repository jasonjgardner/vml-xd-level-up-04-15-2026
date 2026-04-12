import svgPaths from "../../../../svg-2xxt8uep3y";
import type { SpeciesStripVariant } from "../types";
import "./SpeciesStrip.css";

export interface ISpeciesStripProps {
  className?: string;
  variant?: SpeciesStripVariant;
  pokedexNumber: number;
  category: string;
  height: string;
  weight: string;
  radiantRuleText?: string;
}

/**
 * Species strip — metallic horizontal bar beneath the portrait frame showing
 * NO./category/HT/WT. The `radiant` variant adds a holographic
 * "Radiant Pokémon Rule" banner below the main strip.
 *
 * Outer `.card__speciesStrip` positioning (inset percentages against the
 * 733×1024 artboard) lives in BasicCard.css; this component owns the internal
 * layout, the shadow + metallic-gradient SVGs, and the text block.
 */
export function SpeciesStrip({
  className,
  variant = "default",
  pokedexNumber,
  category,
  height,
  weight,
  radiantRuleText,
}: ISpeciesStripProps) {
  return (
    <div
      className={className ? `card__speciesStrip ${className}` : "card__speciesStrip"}
      data-name="Species Strip"
      data-variant={variant}
    >
      <div className={"card__speciesStripShadow"}>
        <svg className={"card__svgFill"} fill="none" preserveAspectRatio="none" viewBox="0 0 660.5 32">
          <g filter="url(#filter0_d_1_488)">
            <path d={svgPaths.p271b79c0} fill="url(#paint0_linear_1_488)" />
            <g>
              <path d={svgPaths.p2e22bd00} fill="url(#paint1_linear_1_488)" />
              <path d={svgPaths.p38aed680} fill="url(#paint2_linear_1_488)" />
            </g>
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="32" id="filter0_d_1_488" width="660.5" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="2" dy="2" />
              <feGaussianBlur stdDeviation="1" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1_488" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_1_488" mode="normal" result="shape" />
            </filter>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_488" x1="315" x2="315" y1="0" y2="28">
              <stop stopColor="#FDFDFD" />
              <stop offset="0.183929" stopColor="#D9DADA" />
              <stop offset="0.329061" stopColor="white" />
              <stop offset="0.580005" stopColor="white" />
              <stop offset="0.750786" stopColor="#DFE0E1" />
              <stop offset="0.900655" stopColor="#AEB1B3" />
              <stop offset="1" stopColor="#969696" />
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_1_488" x1="326.5" x2="326.5" y1="0.451613" y2="28.21">
              <stop stopColor="#888D91" />
              <stop offset="0.217589" stopColor="#969694" />
              <stop offset="0.377254" stopColor="#F3F3F4" />
              <stop offset="0.501698" stopColor="#707172" />
              <stop offset="0.674328" stopColor="#545454" />
              <stop offset="0.864352" stopColor="#C7C7C7" />
              <stop offset="1" stopColor="#888A8B" />
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint2_linear_1_488" x1="326.5" x2="326.5" y1="0.451613" y2="28.21">
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
      <svg className={"card__svgAbsFill"} fill="none" preserveAspectRatio="none" viewBox="0 0 656.5 28">
        <g>
          <path d={svgPaths.p271b79c0} fill="url(#paint0_linear_1_551)" />
          <g>
            <path d={svgPaths.p2e22bd00} fill="url(#paint1_linear_1_551)" />
            <path d={svgPaths.p38aed680} fill="url(#paint2_linear_1_551)" />
          </g>
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_551" x1="315" x2="315" y1="0" y2="28">
            <stop stopColor="#FDFDFD" />
            <stop offset="0.183929" stopColor="#D9DADA" />
            <stop offset="0.329061" stopColor="white" />
            <stop offset="0.40625" stopColor="white" />
            <stop offset="0.552083" stopColor="#DFE0E1" />
            <stop offset="0.900655" stopColor="#AEB1B3" />
            <stop offset="1" stopColor="#969696" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_1_551" x1="326.5" x2="326.5" y1="0.451613" y2="28.21">
            <stop stopColor="#888D91" />
            <stop offset="0.217589" stopColor="#969694" />
            <stop offset="0.377254" stopColor="#F3F3F4" />
            <stop offset="0.501698" stopColor="#707172" />
            <stop offset="0.674328" stopColor="#545454" />
            <stop offset="0.864352" stopColor="#C7C7C7" />
            <stop offset="1" stopColor="#888A8B" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint2_linear_1_551" x1="326.5" x2="326.5" y1="0.451613" y2="28.21">
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
      <div className={"card__speciesStripText"} data-name="Text">
        <p className={"card__speciesItem card__speciesItem--number"}>
          <span className={"card__speciesItem"}>NO.</span>
          <span className={"card__speciesItem card__speciesItem--species"}>{` `}</span>
          <span className={"card__speciesItem"}>{pokedexNumber}</span>
        </p>
        <p className={"card__speciesItem card__speciesItem--species"}>{category}</p>
        <p className={"card__speciesItem"}>HT: {height}</p>
        <p className={"card__speciesItem"}>WT: {weight}</p>
      </div>

      {variant === "radiant" && radiantRuleText && (
        <div className={"card__speciesStripRadiant"} data-name="Radiant Rule">
          <p className={"card__speciesStripRadiantLabel"}>Radiant Pokémon Rule</p>
          <p className={"card__speciesStripRadiantText"}>{radiantRuleText}</p>
        </div>
      )}
    </div>
  );
}
