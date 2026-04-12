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
