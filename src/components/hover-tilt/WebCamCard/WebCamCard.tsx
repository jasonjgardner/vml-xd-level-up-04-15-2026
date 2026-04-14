import { useRef } from "react";
import { HolographicCard, type IHolographicCardProps } from "../HolographicCard/HolographicCard";
import { WEB_CAM_DATA } from "../../card/webcam";
import { useLiveGlareMask } from "./useLiveGlareMask";
import "./WebCamCard.css";

/**
 * WebCamCard
 *
 * A holographic Pokémon card whose portrait is a live webcam feed and whose
 * Hover Tilt glare mask is generated every frame by running MODNet background
 * removal on that feed and compositing the subject inside the portrait-slot
 * region of a card-shaped mask. Falls back to a static mask if webcam access
 * is denied or the ML pipeline fails.
 */
export interface IWebCamCardProps
  extends Omit<IHolographicCardProps, "portrait" | "glareMask"> {
  /** FPS at which bg-removal inference runs (default 3). */
  fps?: number;
  /** Glare mask used before the live mask is ready / on error. */
  fallbackGlareMask?: string;
}

export function WebCamCard({
  fps = 3,
  fallbackGlareMask,
  data,
  ...holo
}: IWebCamCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { maskCssValue, error } = useLiveGlareMask(videoRef, { fps });

  const glareMask = maskCssValue ?? fallbackGlareMask;

  const portrait = (
    <video
      ref={videoRef}
      aria-label={error ? `Web cam unavailable: ${error}` : "Live web cam feed"}
      autoPlay
      className="web-cam-card__video"
      muted
      playsInline
    />
  );

  return (
    <HolographicCard
      {...holo}
      data={{ ...WEB_CAM_DATA, ...data }}
      glareMask={glareMask}
      portrait={portrait}
    />
  );
}

export default WebCamCard;
