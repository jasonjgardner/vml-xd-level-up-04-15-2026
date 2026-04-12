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
