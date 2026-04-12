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
