import type { Meta, StoryObj } from "@storybook/react-vite";
import { TypeBadge } from "./TypeBadge";
import { TYPE_NAMES } from "../types";

const FIGMA_BADGE_SIZE_PX = 38;
const FIGMA_GRID_COLUMN_GAP_PX = 8;
const FIGMA_GRID_ROW_GAP_PX = 7;

function BadgeFrame({ children }: { children: React.ReactNode }) {
  return <div style={{ inlineSize: `${FIGMA_BADGE_SIZE_PX}px`, blockSize: `${FIGMA_BADGE_SIZE_PX}px` }}>{children}</div>;
}

const meta = {
  title: "Card/Primitives/TypeBadge",
  component: TypeBadge,
  parameters: { layout: "centered", backgrounds: { default: "light" } },
  argTypes: { type: { control: "select", options: TYPE_NAMES } },
  args: { type: "Normal" },
  render: (args) => (
    <BadgeFrame>
      <TypeBadge {...args} />
    </BadgeFrame>
  ),
} satisfies Meta<typeof TypeBadge>;

export default meta;
type S = StoryObj<typeof meta>;

export const Playground: S = {};

export const AllTypes: S = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(5, ${FIGMA_BADGE_SIZE_PX}px)`,
        columnGap: `${FIGMA_GRID_COLUMN_GAP_PX}px`,
        rowGap: `${FIGMA_GRID_ROW_GAP_PX}px`,
      }}
    >
      {TYPE_NAMES.map((t) => (
        <BadgeFrame key={t}>
          <TypeBadge type={t} />
        </BadgeFrame>
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
