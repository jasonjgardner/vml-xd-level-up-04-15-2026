# Storybook + BasicCard Decomposition — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Storybook 10 to this Bun-only project and decompose `src/BasicCard.tsx` (925 lines) into ~15 single-purpose components, each with its own folder, scoped CSS, and story set. Every step preserves pixel-identical rendering of the existing `App.tsx` output.

**Architecture:** Bottom-up extraction. Shared types + `TYPE_CONFIG` move to `src/components/card/` first; then each primitive/molecule is pulled out one-per-commit (adding its `.tsx`, `.stories.tsx`, scoped `.css`, and replacing the corresponding inline block in `BasicCard.tsx`); finally `BasicCard` itself moves into the new folder structure with a flat `ICardData` props shape. Storybook runs on its own Vite pipeline next to the existing Bun build; both pipelines read the same `src/index.css`.

**Tech Stack:** Bun, React 19, TypeScript (strict, noEmit), Tailwind v4 via `bun-plugin-tailwind` (main app) and `@tailwindcss/vite` (Storybook), Storybook 10 + Vite + addons (docs, a11y, themes).

**Reference:** Spec at [`docs/superpowers/specs/2026-04-12-storybook-basiccard-decomposition-design.md`](../specs/2026-04-12-storybook-basiccard-decomposition-design.md).

**No test runner configured.** Verification at each task is:
1. `bunx tsc --noEmit` — zero errors
2. `bun dev` — card at [http://localhost:3000](http://localhost:3000) visually matches `debug-screenshots/baseline-pre-storybook.png`
3. After Task 2: `bun storybook` — new stories render at [http://localhost:6006](http://localhost:6006)

---

## File Structure

**New files (created during the migration):**

```
.storybook/
  main.ts                         # Storybook config (Vite + Tailwind)
  preview.ts                      # Global CSS, theme decorator, backgrounds

src/components/card/
  types.ts                        # TypeName, StageName, IAttackEntry, ICardData
  type-config.ts                  # TYPE_CONFIG + SVG def helpers
  smeargle.ts                     # SMEARGLE_DATA default ICardData
  TypeBadge/
    TypeBadge.tsx
    TypeBadge.stories.tsx
    TypeBadge.css
  HpBadge/                        { .tsx, .stories.tsx, .css }
  RegulationMark/                 { .tsx, .stories.tsx, .css }
  RarityMark/                     { .tsx, .stories.tsx, .css }
  SetMark/                        { .tsx, .stories.tsx, .css }
  StagePill/
    StagePill.tsx
    StagePill.stories.tsx
    StagePill.css
    StageLetter.tsx               # internal helper, not exported
  AttackEnergy/                   { .tsx, .stories.tsx, .css }
  Attack/                         { .tsx, .stories.tsx, .css }
  NameHeader/                     { .tsx, .stories.tsx, .css }
  BattleBar/                      { .tsx, .stories.tsx, .css }
  SpeciesStrip/                   { .tsx, .stories.tsx, .css }
  BottomRow/                      { .tsx, .stories.tsx, .css }
  PortraitFrame/                  { .tsx, .stories.tsx, .css }
  CardSurface/                    { .tsx, .stories.tsx, .css }
  BasicCard/
    BasicCard.tsx
    BasicCard.stories.tsx
    BasicCard.css

debug-screenshots/
  baseline-pre-storybook.png      # Reference screenshot for visual parity
```

**Modified files:**

- `package.json` — add 6 devDependencies, 2 scripts
- `src/App.tsx` — change import path to new BasicCard location (Task 18)

**Deleted files (at end of migration):**

- `src/BasicCard.tsx`
- `src/BasicCard.css`

---

## Task 1: Capture baseline screenshot

**Files:**
- Create: `debug-screenshots/baseline-pre-storybook.png`

- [ ] **Step 1: Start the dev server**

Run: `bun dev`
Expected: Server starts at `http://localhost:3000` with HMR enabled. Card renders.

- [ ] **Step 2: Take a full-page screenshot of http://localhost:3000**

Use Chrome DevTools MCP `new_page` → `navigate_page` to `http://localhost:3000` → `resize_page` to `1600x1400` (enough to fit the 733×1024 card + margin) → `take_screenshot` with `fullPage: true` → save to `debug-screenshots/baseline-pre-storybook.png`.

If MCP is unavailable, a manual browser screenshot is acceptable. The file just needs to be a reliable reference for visual diffing later.

- [ ] **Step 3: Verify the file exists and is non-empty**

Run: `ls -la debug-screenshots/baseline-pre-storybook.png`
Expected: File exists, size > 10 KB.

- [ ] **Step 4: Stop the dev server**

Ctrl+C the `bun dev` process.

- [ ] **Step 5: Commit**

```bash
git add debug-screenshots/baseline-pre-storybook.png
git commit -m "chore: capture baseline card screenshot for storybook migration"
```

---

## Task 2: Install Storybook 10 and scaffold config

**Files:**
- Modify: `package.json` (add devDependencies + scripts)
- Create: `.storybook/main.ts`
- Create: `.storybook/preview.ts`

- [ ] **Step 1: Install Storybook deps**

Run:
```bash
bun add -D storybook @storybook/react-vite @storybook/addon-docs @storybook/addon-a11y @storybook/addon-themes @tailwindcss/vite vite
```
Expected: Installation completes; `package.json` gains these entries under `devDependencies`.

- [ ] **Step 2: Create `.storybook/main.ts`**

```typescript
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: ["../src/components/**/*.stories.tsx"],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-themes",
  ],
  typescript: { reactDocgen: "react-docgen-typescript" },
  viteFinal: async (config) => {
    const { default: tailwindcss } = await import("@tailwindcss/vite");
    config.plugins = [...(config.plugins ?? []), tailwindcss()];
    return config;
  },
};

export default config;
```

- [ ] **Step 3: Create `.storybook/preview.ts`**

```typescript
import type { Preview } from "@storybook/react-vite";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import "../src/index.css";

const preview: Preview = {
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "neutral",
      values: [
        { name: "neutral", value: "#e2e2e2" },
        { name: "dark", value: "#0b0b0b" },
        { name: "light", value: "#ffffff" },
      ],
    },
  },
  decorators: [
    withThemeByDataAttribute({
      themes: { light: "light", dark: "dark" },
      defaultTheme: "dark",
      attributeName: "class",
    }),
  ],
};

export default preview;
```

- [ ] **Step 4: Add `storybook` + `build-storybook` scripts**

Edit `package.json` `"scripts"` to add:
```json
"storybook": "storybook dev -p 6006",
"build-storybook": "storybook build -o storybook-static"
```

- [ ] **Step 5: Verify Storybook starts**

Run: `bun storybook`
Expected: Storybook starts at `http://localhost:6006` with no stories yet (empty welcome page). No console errors about missing Tailwind/CSS.
Ctrl+C when done.

- [ ] **Step 6: Verify main app still works**

Run: `bun dev`
Expected: App at :3000 renders the Smeargle card identically. Quick eyeball vs baseline.
Run: `bunx tsc --noEmit`
Expected: zero errors.
Ctrl+C the dev server.

- [ ] **Step 7: Add storybook-static to .gitignore**

Edit `.gitignore` (create if missing) to include:
```
storybook-static/
```

- [ ] **Step 8: Commit**

```bash
git add package.json bun.lock .storybook/ .gitignore
git commit -m "feat: scaffold Storybook 10 with Vite + Tailwind v4 integration"
```

---

## Task 3: Extract shared types and type-config

**Files:**
- Create: `src/components/card/types.ts`
- Create: `src/components/card/type-config.ts`
- Create: `src/components/card/smeargle.ts`
- Modify: `src/BasicCard.tsx` (replace inline types/config with imports)

- [ ] **Step 1: Create `src/components/card/types.ts`**

```typescript
export type TypeName =
  | "Normal"
  | "Fire"
  | "Water"
  | "Lightning"
  | "Fighting"
  | "Psychic"
  | "Metal"
  | "Dragon"
  | "Grass"
  | "Darkness";

export const TYPE_NAMES: readonly TypeName[] = [
  "Normal",
  "Fire",
  "Water",
  "Lightning",
  "Fighting",
  "Psychic",
  "Metal",
  "Dragon",
  "Grass",
  "Darkness",
] as const;

export type StageName = "basic" | "stage-1" | "stage-2";
export type RegulationLetter = "D" | "E" | "F" | "G";
export type RarityShape = "common" | "uncommon" | "rare";
export type RarityFill = "white" | "black";
export type SpeciesStripVariant = "default" | "radiant";

export type IAttackEnergyCount = 1 | 2 | 3 | 4;
export type IRetreatCost = 0 | 1 | 2 | 3 | 4;

export type IAttackEntry =
  | { variant: "basic"; name: string; damage: string; energyCount: IAttackEnergyCount; energyType: TypeName }
  | { variant: "combo"; name: string; description: string; damage: string; energyCount: IAttackEnergyCount; energyType: TypeName }
  | { variant: "condition"; name: string; description: string; energyCount: IAttackEnergyCount; energyType: TypeName }
  | { variant: "ability"; name: string; description: string };

export interface IWeakness {
  type: TypeName;
  multiplier: number;
}

export interface IResistance {
  type: TypeName;
  amount: number;
}

export interface ICardData {
  name: string;
  hp: number;
  type: TypeName;
  stage: StageName;
  evolvesFrom?: string;
  evolvesFromPortraitSrc?: string;

  portraitSrc: string;
  bgSrc: string;
  holoMaskSrc: string;

  attacks: IAttackEntry[];

  weaknessType: TypeName;
  weaknessMultiplier: number;
  resistanceType?: TypeName;
  resistanceAmount?: number;
  retreatCost: IRetreatCost;

  speciesStripVariant: SpeciesStripVariant;
  pokedexNumber: number;
  category: string;
  height: string;
  weight: string;
  radiantRuleText?: string;

  regulationMark: RegulationLetter;
  copyright: string;
  illustrator: string;
  rarityShape: RarityShape;
  rarityFill: RarityFill;
  cardNumber: string;
  flavor: string[];
  setMark: string;
}

export interface ITypeStop {
  offset?: string;
  color: string;
  opacity?: string;
}

export interface ITypeConfig {
  baseFill: string;
  gradientTransform: string;
  stops: ITypeStop[];
  symbolPath: string;
  symbolViewBox: string;
  isGrass?: boolean;
  isPsychic?: boolean;
}
```

- [ ] **Step 2: Create `src/components/card/type-config.ts`**

Move the `TYPE_CONFIG` table and the three SVG-def helper components (`TypeInnerShadow`, `TypeRadialGradient`, `GrassDropShadow`) verbatim from `src/BasicCard.tsx:35-184`. Rewrite imports so this file imports only from `../../../svg-2xxt8uep3y` and `./types`.

```typescript
import svgPaths from "../../../svg-2xxt8uep3y";
import type { ITypeConfig, TypeName } from "./types";

export const GRADIENT_STANDARD  = "translate(17 16.5) rotate(48.3665) scale(24.0832)";
export const GRADIENT_LIGHTNING = "translate(15.5 14) rotate(49.514) scale(26.9537)";
export const GRADIENT_DARKNESS  = "translate(16 15.5) rotate(48.1798) scale(25.4951)";

export const TYPE_CONFIG: Record<TypeName, ITypeConfig> = {
  // ... copy the exact object from src/BasicCard.tsx:39-143 verbatim
};

export function TypeInnerShadow({ id }: { id: string }) {
  // ... copy from src/BasicCard.tsx:145-159 verbatim
}

export function TypeRadialGradient({ id, cfg }: { id: string; cfg: ITypeConfig }) {
  // ... copy from src/BasicCard.tsx:161-169 verbatim
}

export function GrassDropShadow({ id }: { id: string }) {
  // ... copy from src/BasicCard.tsx:171-184 verbatim
}
```

- [ ] **Step 3: Create `src/components/card/smeargle.ts`**

```typescript
import type { ICardData } from "./types";
import imgBg from "../../assets/imgBg.png";
import imgPortraitImage from "../../assets/imgPortraitImage.png";
import { imgRectangle12 } from "../../../svg-3mfyb";

export const SMEARGLE_DATA: ICardData = {
  name: "Smeargle",
  hp: 70,
  type: "Normal",
  stage: "basic",

  portraitSrc: imgPortraitImage,
  bgSrc: imgBg,
  holoMaskSrc: imgRectangle12,

  attacks: [
    {
      variant: "combo",
      name: "Colorful Palette",
      description:
        "Look at the top 5 cards of your deck. You may attach any number of basic Energy cards you find there to 1 of your Pokémon. Shuffle the other cards back into your deck.",
      damage: "",
      energyCount: 1,
      energyType: "Normal",
    },
    { variant: "basic", name: "Ram", damage: "30", energyCount: 2, energyType: "Normal" },
  ],

  weaknessType: "Fighting",
  weaknessMultiplier: 2,
  resistanceType: "Normal",
  resistanceAmount: 30,
  retreatCost: 2,

  speciesStripVariant: "default",
  pokedexNumber: 235,
  category: "Painter Pokémon",
  height: "3´11´´",
  weight: "127.9 lbs.",

  regulationMark: "F",
  copyright: "©2022 Pokémon / Nintendo / Creatures / GAME FREAK ",
  illustrator: "Illus. Mizue",
  rarityShape: "common",
  rarityFill: "black",
  cardNumber: "137/195",
  flavor: [
    "it draws symbols with the fluid that oozes from",
    "the tip of its tail. Depending on the symbol,",
    "Smeargle fanatics will pay big money for them",
  ],
  setMark: "silver-tempest",
};
```

> Note: `variant: "combo"` has empty `damage: ""` because the first Smeargle attack has no damage value. If strict-checking rejects empty-string damage on `combo`, change the entry to `variant: "condition"` (which has no damage field).

- [ ] **Step 4: Rewrite `src/BasicCard.tsx` top section to use the new shared files**

Edit `src/BasicCard.tsx`:
- Remove lines 7–33 (the inline `TypeName` / `ITypeStop` / `ITypeConfig` definitions).
- Remove lines 35–143 (the `GRADIENT_*` constants + `TYPE_CONFIG` table).
- Remove lines 145–184 (the three SVG def helper functions).
- Add these imports at the top (keeping the existing `svgPaths`, `imgRectangle12`, `imgBg`, `imgPortraitImage`, `./BasicCard.css` imports):

```typescript
import type { TypeName, ITypeConfig } from "./components/card/types";
import { TYPE_CONFIG, TypeInnerShadow, TypeRadialGradient, GrassDropShadow } from "./components/card/type-config";
```

- [ ] **Step 5: Typecheck**

Run: `bunx tsc --noEmit`
Expected: zero errors.

- [ ] **Step 6: Verify visual parity**

Run: `bun dev`
Expected: Card at :3000 renders identically to `debug-screenshots/baseline-pre-storybook.png`.
Ctrl+C when done.

- [ ] **Step 7: Commit**

```bash
git add src/components/card/types.ts src/components/card/type-config.ts src/components/card/smeargle.ts src/BasicCard.tsx
git commit -m "refactor: extract TypeName/TYPE_CONFIG/SMEARGLE_DATA to components/card"
```

---

## Task 4: Extract `TypeBadge`

**Files:**
- Create: `src/components/card/TypeBadge/TypeBadge.tsx`
- Create: `src/components/card/TypeBadge/TypeBadge.css`
- Create: `src/components/card/TypeBadge/TypeBadge.stories.tsx`
- Modify: `src/BasicCard.tsx` (replace inline `Type` function call sites with `<TypeBadge>`; remove inline `Type` function)
- Modify: `src/BasicCard.css` (remove `.type*` rules; see list in Step 3)

- [ ] **Step 1: Create `src/components/card/TypeBadge/TypeBadge.tsx`**

Copy the body of the current `Type` function from `src/BasicCard.tsx:191-244` verbatim into this file. Rename the function from `Type` to `TypeBadge`. Drop the `property1` prop name — rename to `type`. Add named export.

> **Rendering model:** The new `TypeBadge` keeps the **existing viewBox-based symbol model** from `BasicCard.tsx` (symbol fills `card__svgAbsFill` with a per-type `symbolViewBox`). This is a drop-in render — zero visual change. The Figma source's per-type inset values (e.g. Fire: `7.89% 10.53%`) are available on `TYPE_CONFIG` entries if we later switch to an inset-based model; that migration is future work and not part of this task.

```tsx
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
```

- [ ] **Step 2: Create `src/components/card/TypeBadge/TypeBadge.css`**

Find all `.type`, `.type__ring`, `.type__symbol`, `.type__symbolGrassShadow`, `.type__psychicExtra` rules in `src/BasicCard.css`. Move them here, wrapped in `@scope (.type)`.

```css
@reference "../../../index.css";

@scope (.type) {
  :scope {
    /* move the existing .type {} body here */
  }

  .type__ring { /* move from BasicCard.css */ }
  .type__symbol { /* move from BasicCard.css */ }
  .type__symbolGrassShadow { /* move from BasicCard.css */ }
  .type__psychicExtra { /* move from BasicCard.css */ }
}
```

Also copy any `.attackEnergy__slot`-style descendant rules that specifically position children *of* `.type` — NOT the rules that position `.type` itself within `.card` (those stay in `BasicCard.css`).

- [ ] **Step 3: Remove moved rules from `src/BasicCard.css`**

Grep `src/BasicCard.css` for `.type` and delete every rule whose selector starts with `.type ` (with a space) or `.type__`. Leave `.card__type*` rules in place — those are still owned by the card.

- [ ] **Step 4: Update `src/BasicCard.tsx` to use `<TypeBadge>`**

- Delete the inline `Type` function (currently at lines 186-244) and its `ITypeProps` interface.
- Add import: `import { TypeBadge } from "./components/card/TypeBadge/TypeBadge";`
- Replace every `<Type ...>` call with `<TypeBadge ...>` and rename `property1={...}` → `type={...}`.

Grep within `src/BasicCard.tsx` for `<Type ` to locate the call sites — expected to be inside `AttackEnergy` (line ~257).

- [ ] **Step 5: Create `src/components/card/TypeBadge/TypeBadge.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TypeBadge } from "./TypeBadge";
import { TYPE_NAMES } from "../types";

const meta = {
  title: "Card/Primitives/TypeBadge",
  component: TypeBadge,
  parameters: { layout: "centered" },
  argTypes: { type: { control: "select", options: TYPE_NAMES } },
  args: { type: "Normal" },
  decorators: [
    (Story) => <div style={{ inlineSize: "3rem", aspectRatio: 1 }}><Story /></div>,
  ],
} satisfies Meta<typeof TypeBadge>;

export default meta;
type S = StoryObj<typeof meta>;

export const Playground: S = {};

export const AllTypes: S = {
  decorators: [(Story) => <Story />],
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 3rem)", gap: "1rem" }}>
      {TYPE_NAMES.map((t) => (
        <div key={t} style={{ inlineSize: "3rem", aspectRatio: 1 }}>
          <TypeBadge type={t} />
        </div>
      ))}
    </div>
  ),
};

export const Normal:    S = { args: { type: "Normal" } };
export const Fire:      S = { args: { type: "Fire" } };
export const Water:     S = { args: { type: "Water" } };
export const Lightning: S = { args: { type: "Lightning" } };
export const Fighting:  S = { args: { type: "Fighting" } };
export const Psychic:   S = { args: { type: "Psychic" } };
export const Metal:     S = { args: { type: "Metal" } };
export const Dragon:    S = { args: { type: "Dragon" } };
export const Grass:     S = { args: { type: "Grass" } };
export const Darkness:  S = { args: { type: "Darkness" } };
```

- [ ] **Step 6: Typecheck + visual diff + Storybook check**

Run in parallel (three terminals or sequentially):
1. `bunx tsc --noEmit` → zero errors
2. `bun dev` → card at :3000 matches baseline
3. `bun storybook` → `Card/Primitives/TypeBadge` appears in sidebar with 12 stories; AllTypes renders 10 distinct badges

- [ ] **Step 7: Commit**

```bash
git add src/components/card/TypeBadge/ src/BasicCard.tsx src/BasicCard.css
git commit -m "feat(card): extract TypeBadge component"
```

---

## Task 5: Extract `HpBadge`

**Files:**
- Create: `src/components/card/HpBadge/HpBadge.tsx`
- Create: `src/components/card/HpBadge/HpBadge.css`
- Create: `src/components/card/HpBadge/HpBadge.stories.tsx`
- Modify: `src/BasicCard.tsx` (replace inline `HpBadge` function; inline calls updated)
- Modify: `src/BasicCard.css` (remove `.card__hpBadge*` internal rules; keep positioning in parent)

- [ ] **Step 1: Create `src/components/card/HpBadge/HpBadge.tsx`**

The current `HpBadge` at `src/BasicCard.tsx:782-820` is hardcoded Normal-type. We parameterize on `type` and pull in the corresponding `TYPE_CONFIG` entry for the symbol.

```tsx
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
```

> Note: the rendered symbol viewBox was previously hardcoded to `0 0 33.5015 38.6842` using `svgPaths.p6185800` (a larger Normal symbol variant). For cross-type reuse we switch to the `cfg.symbolViewBox` + `cfg.symbolPath` from `TYPE_CONFIG`, which gives the same visual result for Normal at this size. Visual diff in Step 6 will confirm.

- [ ] **Step 2: Create `src/components/card/HpBadge/HpBadge.css`**

```css
@reference "../../../index.css";

@scope (.card__hpBadge) {
  :scope {
    position: relative;
    block-size: 100%;
    inline-size: 100%;
  }

  .card__hpBadgeBase { /* move from BasicCard.css */ }
  .card__hpBadgeSymbol { /* internal symbol positioning — the one inside HpBadge */ }
}
```

Move any `.card__hpBadgeBase` / `.card__hpBadgeSymbol` rules from `src/BasicCard.css` into this file. Leave the `.card__hpBadge { inset: …; position: absolute; }` positioning rule **in** `BasicCard.css` — that's the slot position on the card.

- [ ] **Step 3: Update `src/BasicCard.tsx`**

- Delete the inline `HpBadge` function (lines 782-820).
- Add import: `import { HpBadge } from "./components/card/HpBadge/HpBadge";`
- The existing call site `<HpBadge />` (line ~697) now passes `type`: `<HpBadge type="Normal" />` (for Smeargle; will become `<HpBadge type={data.type} />` in Task 18).

- [ ] **Step 4: Create `src/components/card/HpBadge/HpBadge.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { HpBadge } from "./HpBadge";
import { TYPE_NAMES } from "../types";

const meta = {
  title: "Card/Primitives/HpBadge",
  component: HpBadge,
  parameters: { layout: "centered" },
  argTypes: { type: { control: "select", options: TYPE_NAMES } },
  args: { type: "Normal" },
  decorators: [
    (Story) => <div style={{ inlineSize: "4rem", aspectRatio: 1 }}><Story /></div>,
  ],
} satisfies Meta<typeof HpBadge>;

export default meta;
type S = StoryObj<typeof meta>;

export const Playground: S = {};
export const Normal: S = { args: { type: "Normal" } };
```

- [ ] **Step 5: Typecheck + visual diff + Storybook**

1. `bunx tsc --noEmit` → zero errors
2. `bun dev` → visual match vs baseline
3. `bun storybook` → HpBadge story renders

- [ ] **Step 6: Commit**

```bash
git add src/components/card/HpBadge/ src/BasicCard.tsx src/BasicCard.css
git commit -m "feat(card): extract HpBadge component"
```

---

## Task 6: Extract `RegulationMark`

**Files:**
- Create: `src/components/card/RegulationMark/RegulationMark.tsx`
- Create: `src/components/card/RegulationMark/RegulationMark.css`
- Create: `src/components/card/RegulationMark/RegulationMark.stories.tsx`
- Modify: `src/BasicCard.tsx` (replace inline regulation mark block, currently at lines 311-322)
- Modify: `src/BasicCard.css` (move `.card__regulationMark*` internals to new file)

The current inline block renders the "F" letter only. The source Figma file (node `32:369`) ships regulation letters as raster PNGs, not vector paths — so there is no canonical SVG path data to pull. We encode D/E/F/G as a hand-authored `LETTER_PATH` table in this component. These are deliberate hand-drawn glyphs that render at the ~17.5 × 26 pentagon size used on the card; they are the authoritative paths for this codebase going forward.

- [ ] **Step 1: Define the letter path table**

Use exactly these path strings:

- F: `"M7 0V2H3V6H7V8H3V14H0V0H7Z"` (the path currently literal in `src/BasicCard.tsx:319`)
- D: `"M0 0H4C5.5 0 7 1 7 3V11C7 13 5.5 14 4 14H0V0ZM3 2V12H4C4.5 12 5 11.5 5 11V3C5 2.5 4.5 2 4 2H3Z"`
- E: `"M7 0V2H3V6H6V8H3V12H7V14H0V0H7Z"`
- G: `"M4 0C6 0 7 1 7 3H5C5 2.5 4.5 2 4 2H3C2.5 2 2 2.5 2 3V11C2 11.5 2.5 12 3 12H4C4.5 12 5 11.5 5 11V8H4V6H7V14H0V0H4Z"`

All four paths share the same viewBox `0 0 7 14` so they swap cleanly at the same CSS size. "F" is pixel-identical to what ships today; D/E/G are new to this codebase.

- [ ] **Step 2: Create `src/components/card/RegulationMark/RegulationMark.tsx`**

```tsx
import svgPaths from "../../../../svg-2xxt8uep3y";
import type { RegulationLetter } from "../types";
import "./RegulationMark.css";

const LETTER_PATH: Record<RegulationLetter, string> = {
  D: "M0 0H4C5.5 0 7 1 7 3V11C7 13 5.5 14 4 14H0V0ZM3 2V12H4C4.5 12 5 11.5 5 11V3C5 2.5 4.5 2 4 2H3Z",
  E: "M7 0V2H3V6H6V8H3V12H7V14H0V0H7Z",
  F: "M7 0V2H3V6H7V8H3V14H0V0H7Z",
  G: "M4 0C6 0 7 1 7 3H5C5 2.5 4.5 2 4 2H3C2.5 2 2 2.5 2 3V11C2 11.5 2.5 12 3 12H4C4.5 12 5 11.5 5 11V8H4V6H7V14H0V0H4Z",
};

export interface IRegulationMarkProps {
  className?: string;
  mark?: RegulationLetter;
}

/**
 * Regulation mark — pentagon base + single letter (D/E/F/G). Lives in the
 * bottom-left corner of the card.
 */
export function RegulationMark({ className, mark = "F" }: IRegulationMarkProps) {
  return (
    <div className={className ? `card__regulationMark ${className}` : "card__regulationMark"} data-name="Regulation Mark">
      <div className="card__regulationMarkBase">
        <svg className="card__svgFill" fill="none" preserveAspectRatio="none" viewBox="0 0 17.5 26">
          <path d={svgPaths.p31d5ee00} fill="white" stroke="black" />
        </svg>
      </div>
      <div className="card__regulationMarkLetter">
        <svg className="card__svgAbsFill" fill="none" preserveAspectRatio="none" viewBox="0 0 7 14">
          <path d={LETTER_PATH[mark]} fill="black" />
        </svg>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create `src/components/card/RegulationMark/RegulationMark.css`**

```css
@reference "../../../index.css";

@scope (.card__regulationMark) {
  :scope {
    position: relative;
    block-size: 100%;
    inline-size: 100%;
  }

  .card__regulationMarkBase { /* move from BasicCard.css */ }
  .card__regulationMarkLetter { /* move from BasicCard.css */ }
}
```

- [ ] **Step 4: Update `src/BasicCard.tsx`**

- Replace the inline regulation mark block at `src/BasicCard.tsx:311-322` with `<RegulationMark mark="F" />`.
- Add import: `import { RegulationMark } from "./components/card/RegulationMark/RegulationMark";`

- [ ] **Step 5: Create `src/components/card/RegulationMark/RegulationMark.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { RegulationMark } from "./RegulationMark";

const meta = {
  title: "Card/Primitives/RegulationMark",
  component: RegulationMark,
  parameters: { layout: "centered" },
  argTypes: { mark: { control: "radio", options: ["D", "E", "F", "G"] } },
  args: { mark: "F" },
  decorators: [
    (Story) => <div style={{ inlineSize: "2rem", blockSize: "3rem" }}><Story /></div>,
  ],
} satisfies Meta<typeof RegulationMark>;

export default meta;
type S = StoryObj<typeof meta>;

export const Playground: S = {};
export const D: S = { args: { mark: "D" } };
export const E: S = { args: { mark: "E" } };
export const F: S = { args: { mark: "F" } };
export const G: S = { args: { mark: "G" } };
```

- [ ] **Step 6: Typecheck + visual diff + Storybook**

1. `bunx tsc --noEmit` → zero errors
2. `bun dev` → the "F" mark still renders identically in the bottom-left
3. `bun storybook` → RegulationMark story renders; D/E/F/G all visible

- [ ] **Step 7: Commit**

```bash
git add src/components/card/RegulationMark/ src/BasicCard.tsx src/BasicCard.css
git commit -m "feat(card): extract RegulationMark component with letter variants"
```

---

## Task 7: Extract `RarityMark`

**Files:**
- Create: `src/components/card/RarityMark/RarityMark.tsx`
- Create: `src/components/card/RarityMark/RarityMark.css`
- Create: `src/components/card/RarityMark/RarityMark.stories.tsx`
- Modify: `src/BasicCard.tsx` (replace inline rarity block at lines 327-331)
- Modify: `src/BasicCard.css` (move `.card__rarity*` internals)

The current inline block renders a black filled circle (common). We parameterize on `rarity: "common" | "uncommon" | "rare"` and `fill: "white" | "black"`.

- [ ] **Step 1: Create `src/components/card/RarityMark/RarityMark.tsx`**

```tsx
import type { RarityShape, RarityFill } from "../types";
import "./RarityMark.css";

export interface IRarityMarkProps {
  className?: string;
  rarity?: RarityShape;
  fill?: RarityFill;
}

/**
 * Rarity mark — small shape indicating card rarity.
 * common → filled circle, uncommon → filled diamond, rare → filled 5-point star.
 * fill controls ink color (white for dark backgrounds, black for light).
 */
export function RarityMark({ className, rarity = "common", fill = "black" }: IRarityMarkProps) {
  const color = fill === "white" ? "white" : "black";
  return (
    <div
      className={className ? `card__rarity ${className}` : "card__rarity"}
      data-rarity={rarity}
      data-fill={fill}
    >
      <svg className="card__svgAbsFill" fill="none" preserveAspectRatio="none" viewBox="0 0 17 17">
        {rarity === "common" && <circle cx="8.5" cy="8.5" fill={color} r="8.5" />}
        {rarity === "uncommon" && (
          <rect x="2" y="2" width="13" height="13" fill={color} transform="rotate(45 8.5 8.5)" />
        )}
        {rarity === "rare" && (
          <path
            d="M8.5 0.5L10.6 6.1L16.5 6.5L11.9 10.3L13.5 16L8.5 12.8L3.5 16L5.1 10.3L0.5 6.5L6.4 6.1L8.5 0.5Z"
            fill={color}
          />
        )}
      </svg>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/card/RarityMark/RarityMark.css`**

```css
@reference "../../../index.css";

@scope (.card__rarity) {
  :scope {
    position: relative;
    block-size: 100%;
    inline-size: 100%;
  }
}
```

Move any `.card__rarity` internal rules from `src/BasicCard.css`. Keep the `.card__rarity` *positioning* rule (inset / size) in `BasicCard.css`.

- [ ] **Step 3: Update `src/BasicCard.tsx`**

- Replace `src/BasicCard.tsx:327-331` with `<RarityMark rarity="common" fill="black" />`.
- Add import: `import { RarityMark } from "./components/card/RarityMark/RarityMark";`

- [ ] **Step 4: Create `src/components/card/RarityMark/RarityMark.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { RarityMark } from "./RarityMark";

const meta = {
  title: "Card/Primitives/RarityMark",
  component: RarityMark,
  parameters: { layout: "centered", backgrounds: { default: "neutral" } },
  argTypes: {
    rarity: { control: "radio", options: ["common", "uncommon", "rare"] },
    fill: { control: "radio", options: ["white", "black"] },
  },
  args: { rarity: "common", fill: "black" },
  decorators: [
    (Story) => <div style={{ inlineSize: "1.5rem", aspectRatio: 1 }}><Story /></div>,
  ],
} satisfies Meta<typeof RarityMark>;

export default meta;
type S = StoryObj<typeof meta>;

export const Playground: S = {};
export const CommonBlack: S = { args: { rarity: "common", fill: "black" } };
export const CommonWhite: S = { args: { rarity: "common", fill: "white" }, parameters: { backgrounds: { default: "dark" } } };
export const UncommonBlack: S = { args: { rarity: "uncommon", fill: "black" } };
export const UncommonWhite: S = { args: { rarity: "uncommon", fill: "white" }, parameters: { backgrounds: { default: "dark" } } };
export const RareBlack: S = { args: { rarity: "rare", fill: "black" } };
export const RareWhite: S = { args: { rarity: "rare", fill: "white" }, parameters: { backgrounds: { default: "dark" } } };
```

- [ ] **Step 5: Typecheck + visual diff + Storybook**

1. `bunx tsc --noEmit` → zero errors
2. `bun dev` → common-black circle still renders identically
3. `bun storybook` → all 6 rarity combinations render

- [ ] **Step 6: Commit**

```bash
git add src/components/card/RarityMark/ src/BasicCard.tsx src/BasicCard.css
git commit -m "feat(card): extract RarityMark with shape+fill variants"
```

---

## Task 8: Extract `SetMark`

**Files:**
- Create: `src/components/card/SetMark/SetMark.tsx`
- Create: `src/components/card/SetMark/SetMark.css`
- Create: `src/components/card/SetMark/SetMark.stories.tsx`
- Modify: `src/BasicCard.tsx` (replace lines 341-350)
- Modify: `src/BasicCard.css` (move `.card__setMark*` internals)

- [ ] **Step 1: Create `src/components/card/SetMark/SetMark.tsx`**

```tsx
import svgPaths from "../../../../svg-2xxt8uep3y";
import "./SetMark.css";

const SET_PATHS = {
  "silver-tempest": { outline: svgPaths.p529a1c0, fill: svgPaths.p18614080 },
} as const;

export type SetMarkVariant = keyof typeof SET_PATHS;

export interface ISetMarkProps {
  className?: string;
  set?: SetMarkVariant;
}

/**
 * Expansion set mark — small icon denoting the card's set.
 * Currently only "silver-tempest" is supported; add more entries to SET_PATHS.
 */
export function SetMark({ className, set = "silver-tempest" }: ISetMarkProps) {
  const paths = SET_PATHS[set];
  return (
    <div className={className ? `card__setMark ${className}` : "card__setMark"} data-name="Set Mark" data-set={set}>
      <div className="card__setMarkInner">
        <svg className="card__svgFill" fill="none" preserveAspectRatio="none" viewBox="0 0 29 29">
          <g>
            <path d={paths.outline} fill="black" stroke="white" strokeMiterlimit="10" strokeWidth="2" />
            <path d={paths.fill} fill="white" />
          </g>
        </svg>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/card/SetMark/SetMark.css`**

```css
@reference "../../../index.css";

@scope (.card__setMark) {
  :scope {
    position: relative;
    block-size: 100%;
    inline-size: 100%;
  }

  .card__setMarkInner { /* move from BasicCard.css */ }
}
```

- [ ] **Step 3: Update `src/BasicCard.tsx`**

Replace lines 341-350 with `<SetMark set="silver-tempest" />`. Add import.

- [ ] **Step 4: Create `src/components/card/SetMark/SetMark.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SetMark } from "./SetMark";

const meta = {
  title: "Card/Primitives/SetMark",
  component: SetMark,
  parameters: { layout: "centered" },
  argTypes: { set: { control: "radio", options: ["silver-tempest"] } },
  args: { set: "silver-tempest" },
  decorators: [
    (Story) => <div style={{ inlineSize: "2.5rem", aspectRatio: 1 }}><Story /></div>,
  ],
} satisfies Meta<typeof SetMark>;

export default meta;
type S = StoryObj<typeof meta>;

export const Playground: S = {};
export const SilverTempest: S = { args: { set: "silver-tempest" } };
```

- [ ] **Step 5: Typecheck + visual diff + Storybook**
- [ ] **Step 6: Commit**

```bash
git add src/components/card/SetMark/ src/BasicCard.tsx src/BasicCard.css
git commit -m "feat(card): extract SetMark component"
```

---

## Task 9: Extract `StagePill` (with internal `StageLetter`)

**Files:**
- Create: `src/components/card/StagePill/StagePill.tsx`
- Create: `src/components/card/StagePill/StageLetter.tsx`
- Create: `src/components/card/StagePill/StagePill.css`
- Create: `src/components/card/StagePill/StagePill.stories.tsx`
- Modify: `src/BasicCard.tsx` (replace stage block at lines 704-740; remove `StageLetter` function at lines 750-780)
- Modify: `src/BasicCard.css` (move `.card__stage*` and `.card__stageLetter*` internals)

The current stage block hardcodes "BASIC" via 5 stacked `StageLetter` calls. We parameterize on `stage: "basic" | "stage-1" | "stage-2"` and, for stages 1/2, render the "Evolves from Pokemon" text + prev-stage portrait.

- [ ] **Step 1: Create `src/components/card/StagePill/StageLetter.tsx`**

Move lines 750-780 from `BasicCard.tsx` verbatim, keeping `StageLetter` as an internal (not exported from a barrel) helper. Export it for the sibling `StagePill.tsx` import.

```tsx
export interface IStageLetterProps {
  x: string;
  y: string;
  width: number;
  height: number;
  path: string;
  viewBox: string;
  insetClass: string;
}

export function StageLetter({ x, y, width, height, path, viewBox, insetClass }: IStageLetterProps) {
  return (
    <div
      className="card__stageLetter"
      style={{
        blockSize: `${height}px`,
        inlineSize: `${width}px`,
        insetBlockStart: y,
        insetInlineStart: x,
        position: "absolute",
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className={`absolute ${insetClass}`}>
        <svg className="card__svgFill" fill="none" preserveAspectRatio="none" viewBox={viewBox}>
          <path d={path} fill="#545454" stroke="white" />
        </svg>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/card/StagePill/StagePill.tsx`**

```tsx
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
```

- [ ] **Step 3: Create `src/components/card/StagePill/StagePill.css`**

```css
@reference "../../../index.css";

@scope (.card__stage) {
  :scope {
    position: relative;
    block-size: 100%;
    inline-size: 100%;
  }

  .card__stageShadow { /* move from BasicCard.css */ }
  .card__stageLetters { /* move from BasicCard.css */ }
  .card__stageLetter { /* move from BasicCard.css */ }
  .card__stageLabel { /* new; uppercase bold label for Stage 1/2 */ }
  .card__stageEvolvesFrom { /* new; italic "Evolves from X" text */ }
  .card__stageEvolvesFromPortrait { /* new; small portrait frame */ }
}
```

Copy the existing `.card__stageShadow`, `.card__stageLetters`, `.card__stageLetter` rules from `BasicCard.css`. Add new rules for the stage-1/2-only classes modeled on the Figma screenshot (italic Gill Sans, 19px, black).

- [ ] **Step 4: Update `src/BasicCard.tsx`**

- Delete the inline stage block at lines 704-740 and the `StageLetter` function at 750-780.
- Replace the stage block with `<StagePill stage="basic" />`.
- Add import.

- [ ] **Step 5: Create `src/components/card/StagePill/StagePill.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { StagePill } from "./StagePill";

const meta = {
  title: "Card/Primitives/StagePill",
  component: StagePill,
  parameters: { layout: "centered", backgrounds: { default: "neutral" } },
  argTypes: {
    stage: { control: "radio", options: ["basic", "stage-1", "stage-2"] },
    evolvesFrom: { control: "text" },
  },
  args: { stage: "basic" },
  decorators: [
    (Story) => <div style={{ inlineSize: "8rem", blockSize: "2.5rem" }}><Story /></div>,
  ],
} satisfies Meta<typeof StagePill>;

export default meta;
type S = StoryObj<typeof meta>;

export const Playground: S = {};
export const Basic:  S = { args: { stage: "basic" } };
export const Stage1: S = { args: { stage: "stage-1", evolvesFrom: "Pichu" } };
export const Stage2: S = { args: { stage: "stage-2", evolvesFrom: "Pikachu" } };
```

- [ ] **Step 6: Typecheck + visual diff + Storybook**
- [ ] **Step 7: Commit**

```bash
git add src/components/card/StagePill/ src/BasicCard.tsx src/BasicCard.css
git commit -m "feat(card): extract StagePill with basic/stage-1/stage-2 variants"
```

---

## Task 10: Extract `AttackEnergy`

**Files:**
- Create: `src/components/card/AttackEnergy/AttackEnergy.tsx`
- Create: `src/components/card/AttackEnergy/AttackEnergy.css`
- Create: `src/components/card/AttackEnergy/AttackEnergy.stories.tsx`
- Modify: `src/BasicCard.tsx` (remove inline `AttackEnergy` at lines 252-261; extend count to 1|2|3|4)
- Modify: `src/BasicCard.css` (move `.attackEnergy*` internals)

- [ ] **Step 1: Create `src/components/card/AttackEnergy/AttackEnergy.tsx`**

```tsx
import type { IAttackEnergyCount, TypeName } from "../types";
import { TypeBadge } from "../TypeBadge/TypeBadge";
import "./AttackEnergy.css";

export interface IAttackEnergyProps {
  className?: string;
  count: IAttackEnergyCount;
  type?: TypeName;
}

/**
 * A row of N type badges showing the energy cost of an attack.
 * Counts 1-4 supported.
 */
export function AttackEnergy({ className, count, type = "Normal" }: IAttackEnergyProps) {
  const slots = Array.from({ length: count }, (_, i) => i);
  return (
    <div className={className || "attackEnergy"} data-count={count}>
      {slots.map((i) => (
        <TypeBadge key={i} className="attackEnergy__slot" type={type} />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/card/AttackEnergy/AttackEnergy.css`**

```css
@reference "../../../index.css";

@scope (.attackEnergy) {
  :scope { /* move existing .attackEnergy rule from BasicCard.css */ }
  .attackEnergy__slot { /* move from BasicCard.css */ }
}
```

- [ ] **Step 3: Update `src/BasicCard.tsx`**

- Delete the inline `AttackEnergy` function at lines 252-261 and its `IAttackEnergyProps` interface at lines 246-250.
- Add import: `import { AttackEnergy } from "./components/card/AttackEnergy/AttackEnergy";`

- [ ] **Step 4: Create `src/components/card/AttackEnergy/AttackEnergy.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AttackEnergy } from "./AttackEnergy";
import { TYPE_NAMES } from "../types";

const meta = {
  title: "Card/Molecules/AttackEnergy",
  component: AttackEnergy,
  parameters: { layout: "centered", backgrounds: { default: "neutral" } },
  argTypes: {
    count: { control: { type: "radio" }, options: [1, 2, 3, 4] },
    type: { control: "select", options: TYPE_NAMES },
  },
  args: { count: 2, type: "Normal" },
} satisfies Meta<typeof AttackEnergy>;

export default meta;
type S = StoryObj<typeof meta>;

export const Playground: S = {};
export const One:   S = { args: { count: 1 } };
export const Two:   S = { args: { count: 2 } };
export const Three: S = { args: { count: 3 } };
export const Four:  S = { args: { count: 4 } };

export const AllCounts: S = {
  render: () => (
    <div style={{ display: "grid", gap: "1rem" }}>
      {[1, 2, 3, 4].map((c) => (
        <AttackEnergy key={c} count={c as 1 | 2 | 3 | 4} />
      ))}
    </div>
  ),
};
```

- [ ] **Step 5: Typecheck + visual diff + Storybook**
- [ ] **Step 6: Commit**

```bash
git add src/components/card/AttackEnergy/ src/BasicCard.tsx src/BasicCard.css
git commit -m "feat(card): extract AttackEnergy with counts 1-4"
```

---

## Task 11: Extract `Attack`

**Files:**
- Create: `src/components/card/Attack/Attack.tsx`
- Create: `src/components/card/Attack/Attack.css`
- Create: `src/components/card/Attack/Attack.stories.tsx`
- Modify: `src/BasicCard.tsx` (remove inline `Attack` at lines 271-281; expand variants)
- Modify: `src/BasicCard.css` (move `.attack*` internals)

- [ ] **Step 1: Create `src/components/card/Attack/Attack.tsx`**

Supports 4 Figma variants: `basic` / `combo` / `condition` / `ability`.

```tsx
import type { IAttackEnergyCount, TypeName } from "../types";
import { AttackEnergy } from "../AttackEnergy/AttackEnergy";
import "./Attack.css";

export type AttackVariant = "basic" | "combo" | "condition" | "ability";

export interface IAttackProps {
  variant: AttackVariant;
  name: string;
  description?: string;
  damage?: string;
  energyCount?: IAttackEnergyCount;
  energyType?: TypeName;
}

/**
 * One attack (or ability) entry inside the attack frame.
 * - basic:     name + damage + energy
 * - combo:     name + description + damage + energy
 * - condition: name + description + energy (no damage)
 * - ability:   red "Ability" label + red name + description (no energy/damage)
 */
export function Attack({ variant, name, description, damage, energyCount, energyType }: IAttackProps) {
  if (variant === "ability") {
    return (
      <div className={`attack attack--ability`} data-variant="ability">
        <span className="attack__abilityTag">Ability</span>
        <p className="attack__abilityName">{name}</p>
        {description && <p className="attack__description">{description}</p>}
      </div>
    );
  }
  const showDescription = variant === "combo" || variant === "condition";
  const showDamage = variant === "basic" || variant === "combo";
  return (
    <div className={`attack attack--${variant}`} data-variant={variant}>
      <p className="attack__name">{name}</p>
      {showDescription && description && <p className="attack__description">{description}</p>}
      {showDamage && damage && <p className="attack__damage">{damage}</p>}
      {energyCount && (
        <AttackEnergy className="attack__energy" count={energyCount} type={energyType} />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/card/Attack/Attack.css`**

```css
@reference "../../../index.css";

@scope (.attack) {
  :scope { /* move existing .attack rules */ }
  .attack__name { /* move */ }
  .attack__description { /* move */ }
  .attack__damage { /* move */ }
  .attack__energy { /* move */ }

  /* New rules for ability variant */
  .attack__abilityTag {
    @apply inline-block px-[0.5rem] py-[0.15rem] rounded-full text-white text-[1rem] font-bold;
    background: #9c1821;
  }
  .attack__abilityName {
    color: #9c1821;
    font-family: var(--font-gill-sans);
    font-weight: 700;
  }
}
```

Also delete the existing `.attack--withDescription` / `.attack--basic` variant selectors from `BasicCard.css` and replace with `.attack--basic` / `.attack--combo` / `.attack--condition` / `.attack--ability` variant selectors inside the scope.

- [ ] **Step 3: Update `src/BasicCard.tsx`**

- Delete the inline `Attack` function at lines 271-281 and its `IAttackProps` interface at lines 263-269.
- Add import.
- Update the two call sites inside `card__attackFrame` (around line 540) to pass `variant`:
  - First attack (Colorful Palette): `<Attack variant="combo" name="Colorful Palette" description="..." damage="" energyCount={1} />`
  - Second attack (Ram): `<Attack variant="basic" name="Ram" damage="30" energyCount={2} />`

> **Note:** the original code passed `damage={undefined}` for Colorful Palette. With the new `combo` variant we must pass `damage` (may be empty string to suppress rendering). The `{showDamage && damage && ...}` guard in the new component handles both empty string and undefined correctly. Alternatively, switch Smeargle's first attack to `variant: "condition"` in the `SMEARGLE_DATA` default.

- [ ] **Step 4: Create `src/components/card/Attack/Attack.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Attack } from "./Attack";
import { TYPE_NAMES } from "../types";

const meta = {
  title: "Card/Molecules/Attack",
  component: Attack,
  parameters: { layout: "padded", backgrounds: { default: "neutral" } },
  argTypes: {
    variant: { control: "radio", options: ["basic", "combo", "condition", "ability"] },
    energyType: { control: "select", options: TYPE_NAMES },
    energyCount: { control: { type: "radio" }, options: [1, 2, 3, 4] },
  },
  args: {
    variant: "basic",
    name: "Ram",
    damage: "30",
    energyCount: 2,
    energyType: "Normal",
  },
  decorators: [
    (Story) => <div style={{ inlineSize: "620px" }}><Story /></div>,
  ],
} satisfies Meta<typeof Attack>;

export default meta;
type S = StoryObj<typeof meta>;

export const Playground: S = {};

export const Basic: S = { args: { variant: "basic", name: "Ram", damage: "30", energyCount: 2 } };
export const Combo: S = {
  args: {
    variant: "combo",
    name: "Colorful Palette",
    description: "Look at the top 5 cards of your deck. You may attach any number of basic Energy cards you find there to 1 of your Pokémon. Shuffle the other cards back into your deck.",
    damage: "30",
    energyCount: 1,
  },
};
export const Condition: S = {
  args: {
    variant: "condition",
    name: "Colorful Palette",
    description: "Look at the top 5 cards of your deck. You may attach any number of basic Energy cards you find there to 1 of your Pokémon. Shuffle the other cards back into your deck.",
    energyCount: 1,
  },
};
export const Ability: S = {
  args: {
    variant: "ability",
    name: "Hidden Threads",
    description: "Look at the top 5 cards of your deck. You may attach any number of basic Energy cards you find there to 1 of your Pokémon. Shuffle the other cards back into your deck.",
  },
};
```

- [ ] **Step 5: Typecheck + visual diff + Storybook**
- [ ] **Step 6: Commit**

```bash
git add src/components/card/Attack/ src/BasicCard.tsx src/BasicCard.css
git commit -m "feat(card): extract Attack with basic/combo/condition/ability variants"
```

---

## Task 12: Extract `NameHeader`

**Files:**
- Create: `src/components/card/NameHeader/NameHeader.tsx`
- Create: `src/components/card/NameHeader/NameHeader.css`
- Create: `src/components/card/NameHeader/NameHeader.stories.tsx`
- Modify: `src/BasicCard.tsx` (replace name + HP block at lines 687-702)

- [ ] **Step 1: Create `src/components/card/NameHeader/NameHeader.tsx`**

```tsx
import type { TypeName } from "../types";
import { HpBadge } from "../HpBadge/HpBadge";
import "./NameHeader.css";

export interface INameHeaderProps {
  className?: string;
  name: string;
  hp: number;
  type?: TypeName;
}

/**
 * Pokémon name + HP value + type badge row at the top of the card.
 */
export function NameHeader({ className, name, hp, type = "Normal" }: INameHeaderProps) {
  return (
    <div className={className ? `card__hpType ${className}` : "card__hpType"}>
      <p className="card__name">{name}</p>
      <div className="card__hpGroup">
        <div className="card__hpText">
          <p>
            <span className="card__hpLabel">HP</span>
            <span className="card__hpValue">{hp}</span>
          </p>
        </div>
      </div>
      <HpBadge type={type} />
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/card/NameHeader/NameHeader.css`**

```css
@reference "../../../index.css";

@scope (.card__hpType) {
  :scope { /* move from BasicCard.css */ }

  .card__name { /* move from BasicCard.css */ }
  .card__hpGroup { /* move from BasicCard.css */ }
  .card__hpText { /* move from BasicCard.css */ }
  .card__hpLabel { /* move from BasicCard.css */ }
  .card__hpValue { /* move from BasicCard.css */ }
}
```

- [ ] **Step 3: Update `src/BasicCard.tsx`**

- Delete lines 687-702 (the HP+Type block and separate `card__name`).
- Replace with: `<NameHeader name="Smeargle" hp={70} type="Normal" />`
- Add import.

- [ ] **Step 4: Create `src/components/card/NameHeader/NameHeader.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { NameHeader } from "./NameHeader";
import { TYPE_NAMES } from "../types";

const meta = {
  title: "Card/Molecules/NameHeader",
  component: NameHeader,
  parameters: { layout: "centered", backgrounds: { default: "neutral" } },
  argTypes: {
    type: { control: "select", options: TYPE_NAMES },
    hp: { control: { type: "number", min: 10, max: 340, step: 10 } },
  },
  args: { name: "Smeargle", hp: 70, type: "Normal" },
  decorators: [
    (Story) => <div style={{ inlineSize: "500px" }}><Story /></div>,
  ],
} satisfies Meta<typeof NameHeader>;

export default meta;
type S = StoryObj<typeof meta>;

export const Playground: S = {};
export const Smeargle: S = { args: { name: "Smeargle", hp: 70, type: "Normal" } };
export const Charmander: S = { args: { name: "Charmander", hp: 70, type: "Fire" } };
```

- [ ] **Step 5: Typecheck + visual diff + Storybook**
- [ ] **Step 6: Commit**

```bash
git add src/components/card/NameHeader/ src/BasicCard.tsx src/BasicCard.css
git commit -m "feat(card): extract NameHeader component"
```

---

## Task 13: Extract `BattleBar`

**Files:**
- Create: `src/components/card/BattleBar/BattleBar.tsx`
- Create: `src/components/card/BattleBar/BattleBar.css`
- Create: `src/components/card/BattleBar/BattleBar.stories.tsx`
- Modify: `src/BasicCard.tsx` (replace battle-bar block at lines 353-534)
- Modify: `src/BasicCard.css` (move `.card__battleBar*`, `.card__retreat*`, `.card__weakness*`, `.card__resistance*`, `.card__battleText` internals)

This is the largest extraction (~180 lines of inline JSX). We split the SVG-heavy pieces into internal `BattleBarRetreatShape` and `BattleBarWeaknessShape` helpers inside `BattleBar.tsx` to keep the file readable.

- [ ] **Step 1: Create `src/components/card/BattleBar/BattleBar.tsx`**

Move the entire battle-bar JSX from `src/BasicCard.tsx:353-534` into this component. Parameterize weakness/resistance/retreat. Use `TypeBadge` for the weakness/resistance/retreat-cost badges (dropping the hardcoded `ResistanceTypeBadge` / `WeaknessTypeBadge` / `SmallTypeBadge` components — they're now `<TypeBadge type={...} />` at appropriate sizes via container CSS).

```tsx
import svgPaths from "../../../../svg-2xxt8uep3y";
import type { IRetreatCost, IWeakness, IResistance, TypeName } from "../types";
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

/**
 * Battle bar — weakness / resistance / retreat cost row above the bottom strip.
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
      {/* Retreat bar shape — move the existing svgPaths.p3064c000 / p39dd5680 / p158fa080 / p305bdc0 SVG block here verbatim from BasicCard.tsx:355-436 */}
      <div className="card__retreat" data-name="Retreat">
        {/* ... retreat bar chrome ... */}
        <p className="card__retreatLabel">retreat</p>
      </div>

      {/* Weakness base — move svgPaths.p7432c00 etc. block here verbatim from BasicCard.tsx:439-507 */}
      <div className="card__weaknessBase">{/* ... */}</div>

      {resistanceAmount && (
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
            className={`card__retreatCostType card__retreatCostType--${i === 0 ? "first" : i === 1 ? "second" : i === 2 ? "third" : "fourth"}`}
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
```

Fill in the elided `{/* ... retreat bar chrome ... */}` and `{/* ... */}` blocks by copying the exact JSX from `src/BasicCard.tsx:355-436` and `src/BasicCard.tsx:439-507` respectively. Do not rename any class names or SVG paths.

- [ ] **Step 2: Create `src/components/card/BattleBar/BattleBar.css`**

```css
@reference "../../../index.css";

@scope (.card__battleBar) {
  :scope { /* move from BasicCard.css */ }

  .card__retreat, .card__retreatBase, .card__retreatShadowWrap, .card__retreatShadow,
  .card__retreatBar, .card__retreatBarCapEnd, .card__retreatBarCapStart, .card__retreatLabel,
  .card__retreatCost, .card__retreatCostType, .card__retreatCostType--first,
  .card__retreatCostType--second, .card__retreatCostType--third, .card__retreatCostType--fourth,
  .card__weaknessBase, .card__weaknessBaseShadow, .card__weaknessGroup, .card__weaknessLabel,
  .card__weaknessMult, .card__weaknessNum, .card__weaknessType,
  .card__resistanceGroup, .card__resistanceLabel, .card__resistanceMinus, .card__resistanceNum,
  .card__resistanceType,
  .card__battleText {
    /* move each from BasicCard.css */
  }
}
```

Grep `BasicCard.css` for each selector and move the bodies into this file.

- [ ] **Step 3: Update `src/BasicCard.tsx`**

- Delete the battle-bar block at lines 353-534.
- Replace with: `<BattleBar weaknessType="Fighting" weaknessMultiplier={2} resistanceType="Normal" resistanceAmount={30} retreatCost={2} />`
- Add import.

- [ ] **Step 4: Create `src/components/card/BattleBar/BattleBar.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { BattleBar } from "./BattleBar";
import { TYPE_NAMES } from "../types";

const meta = {
  title: "Card/Molecules/BattleBar",
  component: BattleBar,
  parameters: { layout: "padded", backgrounds: { default: "neutral" } },
  argTypes: {
    weaknessType: { control: "select", options: TYPE_NAMES },
    weaknessMultiplier: { control: { type: "number", min: 1, max: 4 } },
    resistanceType: { control: "select", options: [undefined, ...TYPE_NAMES] },
    resistanceAmount: { control: { type: "number", min: 0, max: 60, step: 10 } },
    retreatCost: { control: { type: "range", min: 0, max: 4, step: 1 } },
  },
  args: {
    weaknessType: "Fighting",
    weaknessMultiplier: 2,
    resistanceType: "Normal",
    resistanceAmount: 30,
    retreatCost: 2,
  },
  decorators: [
    (Story) => <div style={{ inlineSize: "680px" }}><Story /></div>,
  ],
} satisfies Meta<typeof BattleBar>;

export default meta;
type S = StoryObj<typeof meta>;

export const Playground: S = {};
export const WithResistance: S = {};
export const NoResistance: S = { args: { resistanceType: undefined, resistanceAmount: undefined } };
```

- [ ] **Step 5: Typecheck + visual diff + Storybook**
- [ ] **Step 6: Commit**

```bash
git add src/components/card/BattleBar/ src/BasicCard.tsx src/BasicCard.css
git commit -m "feat(card): extract BattleBar with weakness/resistance/retreat"
```

---

## Task 14: Extract `SpeciesStrip`

**Files:**
- Create: `src/components/card/SpeciesStrip/SpeciesStrip.tsx`
- Create: `src/components/card/SpeciesStrip/SpeciesStrip.css`
- Create: `src/components/card/SpeciesStrip/SpeciesStrip.stories.tsx`
- Modify: `src/BasicCard.tsx` (replace species-strip block at lines 585-684)
- Modify: `src/BasicCard.css` (move `.card__speciesStrip*` internals)

The current block is "default" variant only. We add `"radiant"` support using the Figma screenshot + asset references.

- [ ] **Step 1: Create `src/components/card/SpeciesStrip/SpeciesStrip.tsx`**

```tsx
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
 * NO./category/HT/WT. Radiant variant adds a holographic "Radiant Pokémon Rule"
 * banner below the main strip.
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
      {/* Shadow + body SVG — move from src/BasicCard.tsx:586-673 verbatim */}
      <div className="card__speciesStripShadow">
        {/* ... */}
      </div>
      {/* ... main strip SVG ... */}

      <div className="card__speciesStripText" data-name="Text">
        <p className="card__speciesItem card__speciesItem--number">
          <span className="card__speciesItem">NO.</span>
          <span className="card__speciesItem card__speciesItem--species">{` `}</span>
          <span className="card__speciesItem">{pokedexNumber}</span>
        </p>
        <p className="card__speciesItem card__speciesItem--species">{category}</p>
        <p className="card__speciesItem">HT: {height}</p>
        <p className="card__speciesItem">WT: {weight}</p>
      </div>

      {variant === "radiant" && radiantRuleText && (
        <div className="card__speciesStripRadiant" data-name="Radiant Rule">
          <p className="card__speciesStripRadiantLabel">Radiant Pokémon Rule</p>
          <p className="card__speciesStripRadiantText">{radiantRuleText}</p>
        </div>
      )}
    </div>
  );
}
```

Fill in the elided SVG blocks by copying from `src/BasicCard.tsx:586-673`.

- [ ] **Step 2: Create `src/components/card/SpeciesStrip/SpeciesStrip.css`**

```css
@reference "../../../index.css";

@scope (.card__speciesStrip) {
  :scope { /* move from BasicCard.css */ }
  .card__speciesStripShadow { /* move */ }
  .card__speciesStripText { /* move */ }
  .card__speciesItem { /* move */ }
  .card__speciesItem--number { /* move */ }
  .card__speciesItem--species { /* move */ }

  /* Radiant variant */
  .card__speciesStripRadiant { /* new: holographic banner below main strip */ }
  .card__speciesStripRadiantLabel {
    color: #201e1f;
    font-weight: 700;
  }
  .card__speciesStripRadiantText {
    color: #201e1f;
    font-size: 1.05rem;
  }
}
```

- [ ] **Step 3: Update `src/BasicCard.tsx`**

- Delete lines 585-684.
- Replace with: `<SpeciesStrip variant="default" pokedexNumber={235} category="Painter Pokémon" height="3´11´´" weight="127.9 lbs." />`
- Add import.

- [ ] **Step 4: Create `src/components/card/SpeciesStrip/SpeciesStrip.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SpeciesStrip } from "./SpeciesStrip";

const meta = {
  title: "Card/Molecules/SpeciesStrip",
  component: SpeciesStrip,
  parameters: { layout: "padded", backgrounds: { default: "neutral" } },
  argTypes: {
    variant: { control: "radio", options: ["default", "radiant"] },
  },
  args: {
    variant: "default",
    pokedexNumber: 235,
    category: "Painter Pokémon",
    height: "3´11´´",
    weight: "127.9 lbs.",
  },
  decorators: [
    (Story) => <div style={{ inlineSize: "700px" }}><Story /></div>,
  ],
} satisfies Meta<typeof SpeciesStrip>;

export default meta;
type S = StoryObj<typeof meta>;

export const Playground: S = {};
export const Default: S = { args: { variant: "default" } };
export const Radiant: S = {
  args: {
    variant: "radiant",
    radiantRuleText: "You can't have more than 1 Radiant Pokémon in your deck.",
  },
};
```

- [ ] **Step 5: Typecheck + visual diff + Storybook**
- [ ] **Step 6: Commit**

```bash
git add src/components/card/SpeciesStrip/ src/BasicCard.tsx src/BasicCard.css
git commit -m "feat(card): extract SpeciesStrip with default/radiant variants"
```

---

## Task 15: Extract `BottomRow`

**Files:**
- Create: `src/components/card/BottomRow/BottomRow.tsx`
- Create: `src/components/card/BottomRow/BottomRow.css`
- Create: `src/components/card/BottomRow/BottomRow.stories.tsx`
- Modify: `src/BasicCard.tsx` (replace bottom block at lines 309-351)
- Modify: `src/BasicCard.css` (move `.card__bottom*`, `.card__copyright`, `.card__illustrator`, `.card__number`, `.card__flavor*` internals)

- [ ] **Step 1: Create `src/components/card/BottomRow/BottomRow.tsx`**

```tsx
import type { RegulationLetter, RarityShape, RarityFill } from "../types";
import { RegulationMark } from "../RegulationMark/RegulationMark";
import { RarityMark } from "../RarityMark/RarityMark";
import { SetMark } from "../SetMark/SetMark";
import "./BottomRow.css";

export interface IBottomRowProps {
  className?: string;
  regulationMark: RegulationLetter;
  copyright: string;
  illustrator: string;
  rarityShape: RarityShape;
  rarityFill: RarityFill;
  cardNumber: string;
  flavor: string[];
  setMark: string;
}

/**
 * The card's bottom metadata row: regulation mark, copyright, illustrator,
 * rarity, card number, flavor text, and expansion set mark.
 */
export function BottomRow({
  className,
  regulationMark,
  copyright,
  illustrator,
  rarityShape,
  rarityFill,
  cardNumber,
  flavor,
  setMark,
}: IBottomRowProps) {
  return (
    <div className={className ? `card__bottom ${className}` : "card__bottom"} data-name="Bottom">
      <RegulationMark mark={regulationMark} />
      <p className="card__copyright">{copyright}</p>
      <p className="card__illustrator">{illustrator}</p>
      <RarityMark rarity={rarityShape} fill={rarityFill} />
      <p className="card__number">{cardNumber}</p>
      <div className="card__flavor">
        {flavor.map((line, i) => (
          <p key={i} className="card__flavorLine">{line}</p>
        ))}
      </div>
      <SetMark set={setMark as "silver-tempest"} />
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/card/BottomRow/BottomRow.css`**

```css
@reference "../../../index.css";

@scope (.card__bottom) {
  :scope { /* move from BasicCard.css */ }
  .card__copyright { /* move */ }
  .card__illustrator { /* move */ }
  .card__number { /* move */ }
  .card__flavor { /* move */ }
  .card__flavorLine { /* move */ }
}
```

- [ ] **Step 3: Update `src/BasicCard.tsx`**

- Delete lines 309-351.
- Replace with:
```tsx
<BottomRow
  regulationMark="F"
  copyright="©2022 Pokémon / Nintendo / Creatures / GAME FREAK "
  illustrator="Illus. Mizue"
  rarityShape="common"
  rarityFill="black"
  cardNumber="137/195"
  flavor={[
    "it draws symbols with the fluid that oozes from",
    "the tip of its tail. Depending on the symbol,",
    "Smeargle fanatics will pay big money for them",
  ]}
  setMark="silver-tempest"
/>
```
- Add import.

- [ ] **Step 4: Create `src/components/card/BottomRow/BottomRow.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { BottomRow } from "./BottomRow";

const meta = {
  title: "Card/Molecules/BottomRow",
  component: BottomRow,
  parameters: { layout: "padded", backgrounds: { default: "neutral" } },
  argTypes: {
    regulationMark: { control: "radio", options: ["D", "E", "F", "G"] },
    rarityShape: { control: "radio", options: ["common", "uncommon", "rare"] },
    rarityFill: { control: "radio", options: ["white", "black"] },
    flavor: { control: "object" },
  },
  args: {
    regulationMark: "F",
    copyright: "©2022 Pokémon / Nintendo / Creatures / GAME FREAK ",
    illustrator: "Illus. Mizue",
    rarityShape: "common",
    rarityFill: "black",
    cardNumber: "137/195",
    flavor: [
      "it draws symbols with the fluid that oozes from",
      "the tip of its tail. Depending on the symbol,",
      "Smeargle fanatics will pay big money for them",
    ],
    setMark: "silver-tempest",
  },
  decorators: [
    (Story) => <div style={{ inlineSize: "700px" }}><Story /></div>,
  ],
} satisfies Meta<typeof BottomRow>;

export default meta;
type S = StoryObj<typeof meta>;

export const Playground: S = {};
export const Default: S = {};
```

- [ ] **Step 5: Typecheck + visual diff + Storybook**
- [ ] **Step 6: Commit**

```bash
git add src/components/card/BottomRow/ src/BasicCard.tsx src/BasicCard.css
git commit -m "feat(card): extract BottomRow composite"
```

---

## Task 16: Extract `PortraitFrame`

**Files:**
- Create: `src/components/card/PortraitFrame/PortraitFrame.tsx`
- Create: `src/components/card/PortraitFrame/PortraitFrame.css`
- Create: `src/components/card/PortraitFrame/PortraitFrame.stories.tsx`
- Modify: `src/BasicCard.tsx` (replace portrait blocks at lines 550-582)
- Modify: `src/BasicCard.css` (move `.card__portraitSlot*`, `.card__portraitFrame*` internals)

- [ ] **Step 1: Create `src/components/card/PortraitFrame/PortraitFrame.tsx`**

```tsx
import svgPaths from "../../../../svg-2xxt8uep3y";
import "./PortraitFrame.css";

export interface IPortraitFrameProps {
  className?: string;
  portraitSrc: string;
}

/**
 * Portrait image slot + surrounding metallic frame with drop-shadow.
 */
export function PortraitFrame({ className, portraitSrc }: IPortraitFrameProps) {
  return (
    <>
      <div className="card__portraitSlot" data-name="Portrait Image">
        <div className="card__portraitSlotBg" />
        <img alt="" className="card__portraitSlotImg" src={portraitSrc} />
      </div>
      <div className={className ? `card__portraitFrame ${className}` : "card__portraitFrame"} data-name="Portrait Frame Mask">
        <div className="card__portraitFrameShadow">
          {/* Move the SVG block from src/BasicCard.tsx:557-580 verbatim */}
          <svg className="card__svgFill" fill="none" preserveAspectRatio="none" viewBox="0 0 631 397">
            {/* ... */}
          </svg>
        </div>
      </div>
    </>
  );
}
```

Fill in the SVG block from `src/BasicCard.tsx:557-580`.

- [ ] **Step 2: Create `src/components/card/PortraitFrame/PortraitFrame.css`**

```css
@reference "../../../index.css";

@scope (.card__portraitFrame) {
  :scope { /* move from BasicCard.css */ }
  .card__portraitFrameShadow { /* move */ }
}

@scope (.card__portraitSlot) {
  :scope { /* move from BasicCard.css */ }
  .card__portraitSlotBg { /* move */ }
  .card__portraitSlotImg { /* move */ }
}
```

- [ ] **Step 3: Update `src/BasicCard.tsx`**

- Delete lines 550-582.
- Replace with: `<PortraitFrame portraitSrc={imgPortraitImage} />`
- Add import.
- Remove the now-unused `imgPortraitImage` import if the only remaining user was the deleted block. Actually keep it — `SMEARGLE_DATA` still references it via `portraitSrc`.

- [ ] **Step 4: Create `src/components/card/PortraitFrame/PortraitFrame.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { PortraitFrame } from "./PortraitFrame";
import imgPortraitImage from "../../../assets/imgPortraitImage.png";

const meta = {
  title: "Card/Organisms/PortraitFrame",
  component: PortraitFrame,
  parameters: { layout: "centered", backgrounds: { default: "neutral" } },
  args: { portraitSrc: imgPortraitImage },
  decorators: [
    (Story) => <div style={{ inlineSize: "635px", blockSize: "400px", position: "relative" }}><Story /></div>,
  ],
} satisfies Meta<typeof PortraitFrame>;

export default meta;
type S = StoryObj<typeof meta>;

export const Playground: S = {};
export const Default: S = {};
```

- [ ] **Step 5: Typecheck + visual diff + Storybook**
- [ ] **Step 6: Commit**

```bash
git add src/components/card/PortraitFrame/ src/BasicCard.tsx src/BasicCard.css
git commit -m "feat(card): extract PortraitFrame component"
```

---

## Task 17: Extract `CardSurface`

**Files:**
- Create: `src/components/card/CardSurface/CardSurface.tsx`
- Create: `src/components/card/CardSurface/CardSurface.css`
- Create: `src/components/card/CardSurface/CardSurface.stories.tsx`
- Modify: `src/BasicCard.tsx` (replace card-base block at lines 291-307)
- Modify: `src/BasicCard.css` (move `.card__surface*` internals)

- [ ] **Step 1: Create `src/components/card/CardSurface/CardSurface.tsx`**

```tsx
import "./CardSurface.css";

export interface ICardSurfaceProps {
  className?: string;
  bgSrc: string;
  holoMaskSrc: string;
}

/**
 * Card surface — yellow outer border + inner base + background image +
 * blend-mode overlay + holographic shimmer + inner shadow.
 */
export function CardSurface({ className, bgSrc, holoMaskSrc }: ICardSurfaceProps) {
  return (
    <>
      <div className="card__border" data-name="Border" />
      <div className={className ? `card__surface ${className}` : "card__surface"} data-name="Surface">
        <div aria-hidden="true" className="card__surfaceBase" />
        <div className="card__surfaceBg" data-name="BG">
          <img alt="" className="card__surfaceBgImg" src={bgSrc} />
        </div>
        <div className="card__surfaceOverlay" data-name="Overlay" />
        <div className="card__surfaceHolo" data-name="Holo">
          <div
            className="card__surfaceHoloLayer"
            style={{ maskImage: `url('${holoMaskSrc}')` }}
          />
        </div>
        <div className="card__surfaceInsetShadow" />
      </div>
    </>
  );
}
```

- [ ] **Step 2: Create `src/components/card/CardSurface/CardSurface.css`**

```css
@reference "../../../index.css";

@scope (.card__surface) {
  :scope { /* move from BasicCard.css */ }
  .card__surfaceBase { /* move */ }
  .card__surfaceBg { /* move */ }
  .card__surfaceBgImg { /* move */ }
  .card__surfaceOverlay { /* move */ }
  .card__surfaceHolo { /* move */ }
  .card__surfaceHoloLayer { /* move */ }
  .card__surfaceInsetShadow { /* move */ }
}
```

Leave `.card__border` in `BasicCard.css` — it's positioned relative to the `.card` root.

- [ ] **Step 3: Update `src/BasicCard.tsx`**

- Delete lines 291-307.
- Replace with: `<CardSurface bgSrc={imgBg} holoMaskSrc={imgRectangle12} />`
- Add import.

- [ ] **Step 4: Create `src/components/card/CardSurface/CardSurface.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CardSurface } from "./CardSurface";
import imgBg from "../../../assets/imgBg.png";
import { imgRectangle12 } from "../../../../svg-3mfyb";

const meta = {
  title: "Card/Organisms/CardSurface",
  component: CardSurface,
  parameters: { layout: "centered", backgrounds: { default: "neutral" } },
  args: { bgSrc: imgBg, holoMaskSrc: imgRectangle12 },
  decorators: [
    (Story) => (
      <div className="card" style={{ inlineSize: "733px", blockSize: "1024px", position: "relative" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CardSurface>;

export default meta;
type S = StoryObj<typeof meta>;

export const Playground: S = {};
export const Default: S = {};
```

- [ ] **Step 5: Typecheck + visual diff + Storybook**
- [ ] **Step 6: Commit**

```bash
git add src/components/card/CardSurface/ src/BasicCard.tsx src/BasicCard.css
git commit -m "feat(card): extract CardSurface component"
```

---

## Task 18: Move `BasicCard` into its folder + prop-ify

**Files:**
- Create: `src/components/card/BasicCard/BasicCard.tsx`
- Create: `src/components/card/BasicCard/BasicCard.css`
- Create: `src/components/card/BasicCard/BasicCard.stories.tsx`
- Modify: `src/App.tsx` (change import path)
- Delete: `src/BasicCard.tsx`
- Delete: `src/BasicCard.css`

- [ ] **Step 1: Create `src/components/card/BasicCard/BasicCard.tsx`**

```tsx
import type { ICardData } from "../types";
import { SMEARGLE_DATA } from "../smeargle";
import { CardSurface } from "../CardSurface/CardSurface";
import { PortraitFrame } from "../PortraitFrame/PortraitFrame";
import { NameHeader } from "../NameHeader/NameHeader";
import { StagePill } from "../StagePill/StagePill";
import { SpeciesStrip } from "../SpeciesStrip/SpeciesStrip";
import { Attack } from "../Attack/Attack";
import { BattleBar } from "../BattleBar/BattleBar";
import { BottomRow } from "../BottomRow/BottomRow";
import "./BasicCard.css";

export interface IBasicCardProps {
  className?: string;
  data?: Partial<ICardData>;
}

/**
 * Composed Pokémon card. Accepts a partial ICardData; any missing fields fall
 * back to SMEARGLE_DATA so `<BasicCard />` with no props renders the canonical
 * Smeargle test card.
 */
export function BasicCard({ className, data }: IBasicCardProps = {}) {
  const d: ICardData = { ...SMEARGLE_DATA, ...data };
  return (
    <div className={className || "card"} data-name="Basic Card">
      <CardSurface bgSrc={d.bgSrc} holoMaskSrc={d.holoMaskSrc} />
      <PortraitFrame portraitSrc={d.portraitSrc} />
      <NameHeader name={d.name} hp={d.hp} type={d.type} />
      <StagePill stage={d.stage} evolvesFrom={d.evolvesFrom} evolvesFromPortraitSrc={d.evolvesFromPortraitSrc} />
      <SpeciesStrip
        variant={d.speciesStripVariant}
        pokedexNumber={d.pokedexNumber}
        category={d.category}
        height={d.height}
        weight={d.weight}
        radiantRuleText={d.radiantRuleText}
      />
      <div className="card__attackFrame" data-name="Attack Frame">
        {d.attacks.map((attack, i) => (
          <Attack
            key={i}
            variant={attack.variant}
            name={attack.name}
            description={"description" in attack ? attack.description : undefined}
            damage={"damage" in attack ? attack.damage : undefined}
            energyCount={"energyCount" in attack ? attack.energyCount : undefined}
            energyType={"energyType" in attack ? attack.energyType : undefined}
          />
        ))}
      </div>
      <BattleBar
        weaknessType={d.weaknessType}
        weaknessMultiplier={d.weaknessMultiplier}
        resistanceType={d.resistanceType}
        resistanceAmount={d.resistanceAmount}
        retreatCost={d.retreatCost}
      />
      <BottomRow
        regulationMark={d.regulationMark}
        copyright={d.copyright}
        illustrator={d.illustrator}
        rarityShape={d.rarityShape}
        rarityFill={d.rarityFill}
        cardNumber={d.cardNumber}
        flavor={d.flavor}
        setMark={d.setMark}
      />
    </div>
  );
}

export default BasicCard;
```

- [ ] **Step 2: Create `src/components/card/BasicCard/BasicCard.css`**

Copy the *remaining* rules from old `src/BasicCard.css` that weren't moved in Tasks 4-17. These are:
- `.card` (root artboard — 733×1024 sizing)
- `.card__border`
- `.card__svgFill`, `.card__svgAbsFill` (shared utility classes — kept here as common)
- `.card__attackFrame` (slot positioning)
- Any `.card__hpBadge`, `.card__stage`, `.card__speciesStrip`, `.card__battleBar`, `.card__bottom`, `.card__hpType`, `.card__portraitSlot`, `.card__portraitFrame`, `.card__setMark`, `.card__rarity`, `.card__regulationMark` rules that are *positioning only* (inset / position / size / transform) — these stay here as they position the slot on the card artboard, not the component's internals.

File structure:
```css
@reference "../../../index.css";

:root {
  --font-gill-sans: Gill Sans, "Gill Sans MT", Calibri, sans-serif;
  --font-trebuchet: "futura-pt", Futura, Trebuchet, "Trebuchet MS", Arial, sans-serif;
}

@scope (.card) {
  :scope {
    @apply relative;
    block-size: 1024px;
    inline-size: 733px;
  }

  .card__border { /* kept — yellow outer border */ }
  .card__svgFill { /* shared utility */ }
  .card__svgAbsFill { /* shared utility */ }
  .card__attackFrame { /* slot */ }

  /* Slot positions (where each extracted component sits) */
  .card__hpType, .card__stage, .card__hpBadge, .card__speciesStrip,
  .card__battleBar, .card__bottom, .card__portraitSlot, .card__portraitFrame,
  .card__setMark, .card__rarity, .card__regulationMark, .card__weaknessType,
  .card__resistanceType, .card__retreat, .card__retreatCost, .card__weaknessBase,
  .card__weaknessGroup, .card__resistanceGroup {
    /* percent-based insets stay here */
  }
}
```

Expected final length: ~100-140 lines (down from 659).

- [ ] **Step 3: Update `src/App.tsx`**

Change the single line that imports BasicCard:
```typescript
// old
import BasicCard from "./BasicCard";

// new
import { BasicCard } from "./components/card/BasicCard/BasicCard";
```

Verify `src/App.tsx` still renders `<BasicCard />` with no props.

- [ ] **Step 4: Delete the old files**

```bash
rm src/BasicCard.tsx src/BasicCard.css
```

- [ ] **Step 5: Create `src/components/card/BasicCard/BasicCard.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { BasicCard } from "./BasicCard";
import { SMEARGLE_DATA } from "../smeargle";
import { TYPE_NAMES } from "../types";

const meta = {
  title: "Card/BasicCard",
  component: BasicCard,
  parameters: { layout: "centered" },
  args: { data: SMEARGLE_DATA },
  argTypes: {
    data: { control: "object" },
  },
  decorators: [
    (Story) => <div style={{ transform: "scale(0.8)", transformOrigin: "top center" }}><Story /></div>,
  ],
} satisfies Meta<typeof BasicCard>;

export default meta;
type S = StoryObj<typeof meta>;

export const Smeargle: S = {};

export const FireStarter: S = {
  args: {
    data: {
      ...SMEARGLE_DATA,
      name: "Charmander",
      type: "Fire",
      hp: 70,
      weaknessType: "Water",
      weaknessMultiplier: 2,
      resistanceType: undefined,
      resistanceAmount: undefined,
    },
  },
};

export const Radiant: S = {
  args: {
    data: {
      ...SMEARGLE_DATA,
      speciesStripVariant: "radiant",
      radiantRuleText: "You can't have more than 1 Radiant Pokémon in your deck.",
    },
  },
};

export const Stage2: S = {
  args: {
    data: {
      ...SMEARGLE_DATA,
      stage: "stage-2",
      evolvesFrom: "Squirtle",
    },
  },
};
```

- [ ] **Step 6: Typecheck + visual diff + Storybook**

1. `bunx tsc --noEmit` → zero errors
2. `bun dev` → Smeargle card at :3000 renders identically to baseline (final pixel-parity check)
3. `bun storybook` → `Card/BasicCard` story shows Smeargle + 3 variant stories

- [ ] **Step 7: Commit**

```bash
git add src/components/card/BasicCard/ src/App.tsx
git rm src/BasicCard.tsx src/BasicCard.css
git commit -m "feat(card): move BasicCard to components/card and prop-ify with ICardData"
```

---

## Task 19: Final verification

**Files:** none modified — this task just runs all checks and captures a post-migration screenshot for the record.

- [ ] **Step 1: Typecheck**

Run: `bunx tsc --noEmit`
Expected: zero errors.

- [ ] **Step 2: Build the main app**

Run: `bun run build`
Expected: Clean `dist/` with bundled JS/CSS/HTML; no errors.

- [ ] **Step 3: Build Storybook**

Run: `bun run build-storybook`
Expected: Clean `storybook-static/` with all ~60 stories rendered as static HTML; no errors.

- [ ] **Step 4: Run dev server + Storybook together, spot-check**

Run (parallel):
- `bun dev` → :3000 loads Smeargle card
- `bun storybook` → :6006 shows the full component tree (Card/Primitives, Card/Molecules, Card/Organisms, Card/BasicCard)

Spot-check each category in Storybook: click through TypeBadge AllTypes, Attack variants, StagePill variants, RarityMark variants, BasicCard.Smeargle.

- [ ] **Step 5: Capture post-migration screenshot**

Use Chrome DevTools MCP (or manual) to screenshot `http://localhost:3000` and save as `debug-screenshots/post-migration.png`.

Compare visually against `debug-screenshots/baseline-pre-storybook.png`. Any ≤1px drift in the TypeBadge symbol positions is acceptable (flagged in spec §8 as the TypeBadge unification risk). Anything larger than that needs investigation before marking the task done.

- [ ] **Step 6: Commit (final marker)**

```bash
git add debug-screenshots/post-migration.png
git commit -m "chore: capture post-migration baseline screenshot"
```

---

## Verification Checklist (end of every task)

For every task that touches the card (Tasks 3-18), the verification block at the end of the task runs:

1. **Typecheck:** `bunx tsc --noEmit` → zero errors.
2. **Main app visual parity:** `bun dev`, open :3000, compare against `debug-screenshots/baseline-pre-storybook.png`. Must match.
3. **Storybook:** `bun storybook`, confirm the new story (or updated story) renders.

If any of these fail, do not mark the task done. Revert if needed; diagnose the failure. Investigate root cause — do not merge a regression and plan to fix later.
