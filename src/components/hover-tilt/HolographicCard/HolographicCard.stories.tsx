import type { Meta, StoryObj } from "@storybook/react-vite";
import { HolographicCard } from "./HolographicCard";

const meta = {
  title: "HoverTilt/HolographicCard",
  component: HolographicCard,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div style={{ transform: "scale(0.8)", transformOrigin: "top center" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HolographicCard>;

export default meta;
type S = StoryObj<typeof meta>;

export const Default: S = {};
