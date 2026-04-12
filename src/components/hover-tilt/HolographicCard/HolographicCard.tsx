import "hover-tilt/web-component";
import BasicCard from "../../card/BasicCard/BasicCard";

export function HolographicCard() {
  return (
    /* @ts-ignore - TypeScript doesn't know about the hover-tilt web component, but it works fine in practice */
    <hover-tilt tilt-factor="1.5" scale-factor="1.1" shadow>
      <BasicCard />
      {/* @ts-ignore - TypeScript doesn't know about the hover-tilt web component, but it works fine in practice */}
    </hover-tilt>
  );
}
