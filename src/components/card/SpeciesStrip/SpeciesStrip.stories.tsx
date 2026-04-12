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
    (Story) => <div style={{ inlineSize: "700px", position: "relative" }}><Story /></div>,
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
