import svgPaths from "../svg-2xxt8uep3y";
import { imgRectangle12 } from "../svg-3mfyb";
import imgBg from "./assets/imgBg.png";
import imgPortraitImage from "./assets/imgPortraitImage.png";
import "./BasicCard.css";
import { Attack } from "./components/card/Attack/Attack";
import { BattleBar } from "./components/card/BattleBar/BattleBar";
import { NameHeader } from "./components/card/NameHeader/NameHeader";
import { RarityMark } from "./components/card/RarityMark/RarityMark";
import { RegulationMark } from "./components/card/RegulationMark/RegulationMark";
import { SetMark } from "./components/card/SetMark/SetMark";
import { StagePill } from "./components/card/StagePill/StagePill";

interface IBasicCardProps {
  className?: string;
  attackFrame?: React.ReactNode | null;
  portrait?: React.ReactNode | null;
}

export default function BasicCard({ className, attackFrame = null, portrait = null }: IBasicCardProps) {
  return (
    <div className={className || "card"} data-name="Basic Card">
      {/* Card base: outer yellow border + inner surface with bg/overlay/holo */}
      <div className={"card__border"} data-name="Border" />
      <div className={"card__surface"} data-name="Surface">
        <div aria-hidden="true" className={"card__surfaceBase"} />
        <div className={"card__surfaceBg"} data-name="BG">
          <img alt="" className={"card__surfaceBgImg"} src={imgBg} />
        </div>
        <div className={"card__surfaceOverlay"} data-name="Overlay" />
        <div className={"card__surfaceHolo"} data-name="Holo">
          <div
            className={"card__surfaceHoloLayer"}
            style={{ maskImage: `url('${imgRectangle12}')` }}
          />
        </div>
        <div className={"card__surfaceInsetShadow"} />
      </div>

      {/* Bottom metadata row (copyright, illustrator, rarity, number, flavor, set mark) */}
      <div className={"card__bottom"} data-name="Bottom">
        <RegulationMark mark="F" />

        <p className={"card__copyright"}>©2022 Pokémon / Nintendo / Creatures / GAME FREAK </p>
        <p className={"card__illustrator"}>Illus. Mizue</p>

        <RarityMark rarity="common" fill="black" />

        <p className={"card__number"}>137/195</p>

        <div className={"card__flavor"}>
          <p className={"card__flavorLine"}>it draws symbols with the fluid that oozes from</p>
          <p className={"card__flavorLine"}>the tip of its tail. Depending on the symbol,</p>
          <p className={"card__flavorLine"}>Smeargle fanatics will pay big money for them</p>
        </div>

        <SetMark set="silver-tempest" />
      </div>

      {/* Battle bar: weakness / resistance / retreat cost */}
      <BattleBar
        weaknessType="Fighting"
        weaknessMultiplier={2}
        resistanceType="Normal"
        resistanceAmount={30}
        retreatCost={2}
      />

      {/* Attack frame (slot; defaults show Smeargle's attacks) */}
      <div className={"card__attackFrame"} data-name="Attack Frame">
        {attackFrame || (
          <>
            <Attack
              variant="combo"
              name="Colorful Palette"
              description="Look at the top 5 cards of your deck. You may attach any number of basic Energy cards you find there to 1 of your Pokémon. Shuffle the other cards back into your deck."
              damage=""
              energyCount={1}
              energyType="Normal"
            />
            <Attack variant="basic" name="Ram" damage="30" energyCount={2} energyType="Normal" />
          </>
        )}
      </div>

      {/* Portrait artwork slot + surrounding metallic frame */}
      <div className={"card__portraitSlot"} data-name="Portrait Image">
        <div className={"card__portraitSlotBg"} />
        <img alt="" className={"card__portraitSlotImg"} src={imgPortraitImage} />
      </div>
      <div className={"card__portraitFrame"} data-name="Portrait Frame Mask">
        <div className={"card__portraitFrameShadow"}>
          <svg className={"card__svgFill"} fill="none" preserveAspectRatio="none" viewBox="0 0 631 397">
            <g filter="url(#filter0_d_1_564)">
              <path d={svgPaths.p1c6faf00} fill="url(#paint0_linear_1_564)" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="397" id="filter0_d_1_564" width="631" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="2" dy="2" />
                <feGaussianBlur stdDeviation="1" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1_564" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_1_564" mode="normal" result="shape" />
              </filter>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_564" x1="0" x2="626.137" y1="0" y2="394.37">
                <stop stopColor="#BDBEC0" />
                <stop offset="0.19154" stopColor="#F9FBFA" />
                <stop offset="0.655273" stopColor="#9FA3A3" />
                <stop offset="0.82283" stopColor="#F5F5F5" />
                <stop offset="1" stopColor="#D9D9D9" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Species strip with NO. / category / HT / WT */}
      <div className={"card__speciesStrip"} data-name="Species Strip">
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
            <span className={"card__speciesItem"}>235</span>
          </p>
          <p className={"card__speciesItem card__speciesItem--species"}>Painter Pokémon</p>
          <p className={"card__speciesItem"}>HT: 3´11´´</p>
          <p className={"card__speciesItem"}>WT: 127.9 lbs.</p>
        </div>
      </div>

      {/* Name + HP + type badge (top-right header row) */}
      <NameHeader name="Smeargle" hp={70} type="Normal" />

      {/* Stage pill (BASIC) */}
      <StagePill stage="basic" />

      {/* Portrait (optional custom overlay) */}
      <div className={"card__portrait"} data-name="Portrait">
        {portrait || null}
      </div>
    </div>
  );
}

