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
