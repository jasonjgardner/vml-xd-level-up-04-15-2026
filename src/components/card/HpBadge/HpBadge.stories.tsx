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
