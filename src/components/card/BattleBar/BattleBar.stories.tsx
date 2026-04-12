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
    resistanceType: { control: "select", options: TYPE_NAMES },
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
    (Story) => <div style={{ inlineSize: "680px", position: "relative" }}><Story /></div>,
  ],
} satisfies Meta<typeof BattleBar>;

export default meta;
type S = StoryObj<typeof meta>;

export const Playground: S = {};
export const WithResistance: S = {};
export const NoResistance: S = { args: { resistanceType: undefined, resistanceAmount: undefined } };
