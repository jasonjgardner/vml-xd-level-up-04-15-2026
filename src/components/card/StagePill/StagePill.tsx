import svgPaths from "../../../../svg-2xxt8uep3y";
import type { StageName } from "../types";
import { StageLetter } from "./StageLetter";
import "./StagePill.css";

export interface IStagePillProps {
  className?: string;
  stage?: StageName;
  evolvesFrom?: string;
  evolvesFromPortraitSrc?: string;
}

const BASIC_LETTERS = [
  { x: "calc(50% - 31.81px)", y: "calc(50% - 0.98px)", width: 18.928, height: 12.988, path: svgPaths.p2e78e8c0, viewBox: "0 0 20.7568 14.9883", insetClass: "inset-[-7.7%_-5.28%_-7.7%_-4.38%]" },
  { x: "calc(50% + 6.07px)",  y: "calc(50% - 0.99px)", width: 17.996, height: 12.981, path: svgPaths.p19191e00, viewBox: "0 0 19.9246 14.9808", insetClass: "inset-[-7.7%_-5.56%_-7.7%_-5.16%]" },
  { x: "calc(50% - 14.3px)",  y: "calc(50% - 0.97px)", width: 19.727, height: 12.958, path: svgPaths.pd4b4c00,  viewBox: "0 0 21.2712 14.958",  insetClass: "inset-[-7.72%_-5.07%_-7.72%_-2.76%]" },
  { x: "calc(50% + 30.93px)", y: "calc(50% - 0.97px)", width: 17.596, height: 12.993, path: svgPaths.p31405800, viewBox: "0 0 19.5956 14.9931", insetClass: "inset-[-7.7%_-5.68%]" },
  { x: "calc(50% + 18.18px)", y: "calc(50% - 0.97px)", width: 6.914,  height: 12.984, path: svgPaths.p1b4a0270, viewBox: "0 0 8.64056 14.9836", insetClass: "inset-[-7.7%_-14.46%_-7.7%_-10.5%]" },
] as const;

/**
 * Stage pill — metallic "BASIC" / "STAGE 1" / "STAGE 2" indicator above the
 * Pokémon name. Stages 1/2 include an "Evolves from X" note + small portrait
 * of the previous-stage Pokémon.
 *
 * Filter/gradient IDs are namespaced with `_stage` suffixes (vs. the original
 * inline `_1_543`) so multiple cards can be rendered on one page without
 * SVG `id` collisions.
 */
export function StagePill({ className, stage = "basic", evolvesFrom, evolvesFromPortraitSrc }: IStagePillProps) {
  return (
    <div className={className ? `card__stage ${className}` : "card__stage"} data-stage={stage} data-name="Stage">
      <div className="card__stageShadow">
        <svg className="card__svgFill" fill="none" preserveAspectRatio="none" viewBox="0 0 109 37">
          <g filter="url(#filter0_d_stage)">
            <path d={svgPaths.p1ac5e700} fill="url(#paint0_linear_stage)" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="37" id="filter0_d_stage" width="109" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="1" dy="1" />
              <feGaussianBlur stdDeviation="1" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_stage" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_stage" mode="normal" result="shape" />
            </filter>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_stage" x1="53.5" x2="53.5" y1="1" y2="34">
              <stop stopColor="#FEFFFF" />
              <stop offset="0.0935292" stopColor="#FEFFFF" />
              <stop offset="0.182883" stopColor="#BDBCC1" />
              <stop offset="0.272236" stopColor="#FEFFFF" />
              <stop offset="0.544999" stopColor="#FEFFFF" />
              <stop offset="0.838956" stopColor="#969694" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {stage === "basic" && (
        <div className="card__stageLetters">
          {BASIC_LETTERS.map((letter, i) => (
            <StageLetter key={i} {...letter} />
          ))}
        </div>
      )}
      {stage !== "basic" && (
        <p className="card__stageLabel">
          {stage === "stage-1" ? "STAGE 1" : "STAGE 2"}
        </p>
      )}
      {stage !== "basic" && evolvesFrom && (
        <>
          <p className="card__stageEvolvesFrom">Evolves from {evolvesFrom}</p>
          {evolvesFromPortraitSrc && (
            <div className="card__stageEvolvesFromPortrait">
              <img alt="" src={evolvesFromPortraitSrc} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
