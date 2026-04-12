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
