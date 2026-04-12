import type { Meta, StoryObj } from "@storybook/react-vite";
import { PortraitFrame } from "./PortraitFrame";
import imgPortraitImage from "../../../assets/imgPortraitImage.png";

const VIDEO_SRC = "https://cdn.jsdelivr.net/npm/big-buck-bunny-1080p@0.0.6/video.mp4";

const meta = {
  title: "Card/Organisms/PortraitFrame",
  component: PortraitFrame,
  parameters: { layout: "centered", backgrounds: { default: "neutral" } },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: "635px", blockSize: "400px", position: "relative" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PortraitFrame>;

export default meta;
type S = StoryObj<typeof meta>;

export const Playground: S = {
  args: {
    children: <img alt="" src={imgPortraitImage} />,
  },
};

export const Default: S = {
  args: {
    children: <img alt="" src={imgPortraitImage} />,
  },
};

export const VideoPortrait: S = {
  args: {
    children: (
      <video autoPlay loop muted playsInline src={VIDEO_SRC} />
    ),
  },
};
