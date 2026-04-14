import type { Meta, StoryObj } from "@storybook/react-vite";
import { WebCamCard } from "./WebCamCard";

const meta = {
  title: "HoverTilt/WebCamCard",
  component: WebCamCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Holographic card whose portrait is the user's webcam and whose Hover Tilt glare mask is generated live by running MODNet background removal on the feed and compositing the subject silhouette inside the portrait-slot region of a card-shaped mask (vertical alternating gradient stripes behind the subject, transparent elsewhere). Requires webcam permission; gracefully degrades to a static `fallbackGlareMask` on denial.",
      },
    },
  },
  argTypes: {
    fps: { control: { type: "range", min: 0.5, max: 10, step: 0.5 } },
    fallbackGlareMask: { control: "text" },
    tiltFactor: { control: { type: "range", min: 0, max: 3, step: 0.1 } },
    scaleFactor: { control: { type: "range", min: 1, max: 1.5, step: 0.05 } },
    shadow: { control: "boolean" },
    blendMode: {
      control: "select",
      options: [
        undefined,
        "overlay",
        "luminosity",
        "color-dodge",
        "plus-lighter",
        "screen",
        "soft-light",
      ],
    },
    glareIntensity: { control: { type: "range", min: 0, max: 8, step: 0.25 } },
    glareHue: { control: { type: "range", min: 0, max: 360, step: 1 } },
    glareMaskMode: {
      control: "select",
      options: [undefined, "luminance", "alpha", "match-source"],
    },
    glareMaskComposite: {
      control: "select",
      options: [undefined, "add", "subtract", "intersect", "exclude"],
    },
    shine: { control: { type: "range", min: 0, max: 2, step: 0.05 } },
    innerBrightness: { control: { type: "range", min: 0, max: 2, step: 0.05 } },
    outerBrightness: { control: { type: "range", min: 0, max: 2, step: 0.05 } },
    rainbowSaturation: { control: { type: "range", min: 0, max: 3, step: 0.1 } },
    tileSize: { control: "text" },
  },
  decorators: [
    (Story) => (
      <div style={{ transform: "scale(0.8)", transformOrigin: "top center" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WebCamCard>;

export default meta;
type S = StoryObj<typeof meta>;

export const Default: S = {
  args: {
    fps: 3,
    tiltFactor: 1.5,
    scaleFactor: 1.1,
    shadow: true,
    blendMode: "luminosity",
    glareIntensity: 4,
    glareMaskMode: "luminance",
  },
};

export const HighFps: S = {
  args: {
    fps: 6,
    tiltFactor: 1.5,
    scaleFactor: 1.1,
    shadow: true,
    blendMode: "luminosity",
    glareIntensity: 4,
    glareMaskMode: "luminance",
    rainbowSaturation: 1.6,
  },
};

export const StaticFallback: S = {
  args: {
    fps: 2,
    glareMaskMode: "luminance",
    blendMode: "luminosity",
    glareIntensity: 4,
  },
};
