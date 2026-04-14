import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Card artboard dimensions that the mask is authored against. The final
 * output canvas matches this aspect ratio so `mask-size: cover` in CSS
 * maps 1:1 onto the `.holographic-card` surface.
 */
const CARD_W = 733;
const CARD_H = 1024;

/**
 * Longest edge of the encoded mask. Smaller than the full 733×1024 artboard
 * for encoding throughput; CSS scales back up via `mask-size: cover`.
 */
const MASK_MAX_EDGE = 512;

/**
 * Portrait-slot inset fractions — must stay in sync with the
 * `.card__portraitSlot` rule in `components/card/BasicCard/BasicCard.css`.
 * Everything outside this inset stays fully transparent in the mask so the
 * holographic foil does not paint over the card frame, type row, attacks,
 * or battle bar.
 */
const SLOT_TOP = 0.0996;
const SLOT_RIGHT = 0.0805;
const SLOT_BOTTOM = 0.5264;
const SLOT_LEFT = 0.0778;

/** Encoding format for the mask blob. WebP w/ alpha is ~3× faster than PNG. */
const MASK_MIME = "image/webp";
const MASK_QUALITY = 0.85;

/**
 * Stripe pattern knobs. The portrait-slot region is filled with
 * `STRIPE_COUNT` equal-width vertical columns; each column is a *vertical*
 * linear gradient from a neutral mid-grey at 50% opacity on one end to
 * solid white (`STRIPE_LIGHT`) on the other, with the direction flipped on
 * every other column. The half-alpha grey stop keeps the "off" part of
 * each stripe visible as a soft neutral — not a hard black, not fully
 * transparent — so the glare reads as a gentle modulation rather than
 * stark on/off bars.
 */
const STRIPE_COUNT = 48;
const STRIPE_LIGHT = 255;
const STRIPE_NEUTRAL = "rgb(128 128 128 / 0.5)";

/** Additive draws of the α(1−α) edge-glow layer. Higher = brighter outlines
 *  along the subject boundary. 4 maps peak alpha ≈ 0.25 → ≈ 1.0. */
const EDGE_GLOW_PASSES = 4;

export interface IUseLiveGlareMaskOptions {
  /** Frames per second to run bg-removal inference (default 3). */
  fps?: number;
}

export interface IUseLiveGlareMaskResult {
  /** CSS-ready `url('blob:...')` value to pass as a glare mask. */
  maskCssValue: string | undefined;
  /** Most recent error (webcam denial, pipeline load failure, etc.). */
  error: string | undefined;
  /** True once the pipeline has produced at least one frame. */
  ready: boolean;
}

interface IRawImageLike {
  toCanvas?: () => HTMLCanvasElement | OffscreenCanvas;
  width: number;
  height: number;
}

type SegmenterInput = HTMLCanvasElement | OffscreenCanvas | HTMLVideoElement | ImageData | string;
type Segmenter = (input: SegmenterInput) => Promise<IRawImageLike | IRawImageLike[]>;

// Module-level cache so repeated mounts reuse expensive setup.
let segmenterPromise: Promise<Segmenter> | null = null;

const buildSegmenter = async (): Promise<Segmenter> => {
  const { pipeline } = await import("@huggingface/transformers");
  // Prefer WebGPU (~10× faster than WASM). Fall back silently if the runtime
  // refuses — e.g. no WebGPU, missing adapter, or model shape unsupported.
  try {
    const seg = await pipeline("background-removal", "Xenova/modnet", {
      dtype: "fp32",
      device: "webgpu",
    });
    return seg as unknown as Segmenter;
  } catch {
    const seg = await pipeline("background-removal", "Xenova/modnet", { dtype: "fp32" });
    return seg as unknown as Segmenter;
  }
};

const getSegmenter = (): Promise<Segmenter> => {
  segmenterPromise ??= buildSegmenter();
  return segmenterPromise;
};

const unwrapRawImage = (result: IRawImageLike | IRawImageLike[]): IRawImageLike | undefined =>
  Array.isArray(result) ? result[0] : result;

const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob | null> =>
  new Promise((resolve) => canvas.toBlob(resolve, MASK_MIME, MASK_QUALITY));

/**
 * Paints `STRIPE_COUNT` vertical gradient columns across `canvas`, alternating
 * gradient direction every column. Kept as a standalone helper so callers can
 * cache the resulting canvas — the pattern is static and only depends on the
 * slot dimensions.
 */
const paintStripePattern = (canvas: HTMLCanvasElement): void => {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D canvas context unavailable");
  const { width: w, height: h } = canvas;
  ctx.clearRect(0, 0, w, h);
  const colW = w / STRIPE_COUNT;
  const light = `rgb(${STRIPE_LIGHT} ${STRIPE_LIGHT} ${STRIPE_LIGHT})`;
  Array.from({ length: STRIPE_COUNT }).forEach((_, i) => {
    const x = i * colW;
    const reverse = i % 2 === 1;
    // Vertical gradient per column, alternating direction. Column N goes
    // dark-top→light-bottom, column N+1 goes light-top→dark-bottom — so
    // adjacent column edges sit at opposite ends of the 0..255 range at
    // every y, maximising the column-to-column contrast.
    const gradient = ctx.createLinearGradient(0, reverse ? h : 0, 0, reverse ? 0 : h);
    gradient.addColorStop(0, STRIPE_NEUTRAL);
    gradient.addColorStop(1, light);
    ctx.fillStyle = gradient;
    // +1 on width: guards against subpixel gaps between columns at integer fills.
    ctx.fillRect(x, 0, colW + 1, h);
  });
};

/**
 * Streams the user's webcam into `videoRef`, periodically runs MODNet
 * background removal on frames, and composites a striped portrait-slot
 * silhouette mask suitable for hover-tilt's `glare-mask` attribute.
 *
 * Output layout (transparent outside the portrait slot):
 *
 *   ┌──────────────────────────────────────────┐
 *   │  (fully transparent — no glare here)     │
 *   │    ┌────────────────────────────────┐    │
 *   │    │  ║ ║ ║ ║ stripe gradient ║ ║ ║ │    │  ← portrait slot
 *   │    │  ║ ║  ░░ silhouette ░░    ║ ║ │    │    (same inset as
 *   │    │  ║ ║ ║ ║ ║ ║ ║ ║ ║ ║ ║ ║ ║ ║ │    │     BasicCard.css)
 *   │    └────────────────────────────────┘    │
 *   │                                          │
 *   │  (bottom padding — mask stays clear      │
 *   │   so attacks / battle bar read normally) │
 *   └──────────────────────────────────────────┘
 *
 * Compositing pipeline (per frame, clipped to the slot rect):
 *  1. Clear the entire output canvas to transparent.
 *  2. Clip to the portrait-slot rect.
 *  3. Paint the cached vertical-stripe gradient pattern.
 *  4. `destination-out` a mirrored black silhouette → punches the subject
 *     area to transparent. Contain-fit so the whole person stays in frame.
 *  5. N× additive α(1−α) edge-glow draws for a bright boundary.
 *
 * Performance:
 *  - Pipeline runs on WebGPU when available (~10× WASM).
 *  - Output canvas is ~MASK_MAX_EDGE on its longest side, not the full
 *    733×1024 artboard — CSS scales back up via `mask-size: cover`.
 *  - Encoding is async `toBlob` (WebP) + `URL.createObjectURL`, not
 *    synchronous base64 `toDataURL`. Previous blob URLs are revoked.
 *
 * Gracefully degrades: if webcam access is denied or the pipeline fails,
 * `maskCssValue` stays `undefined` and consumers can fall back to a static
 * mask.
 */
export function useLiveGlareMask(
  videoRef: RefObject<HTMLVideoElement | null>,
  { fps = 3 }: IUseLiveGlareMaskOptions = {},
): IUseLiveGlareMaskResult {
  const [maskCssValue, setMaskCssValue] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [ready, setReady] = useState(false);
  const disposedRef = useRef(false);

  useEffect(() => {
    disposedRef.current = false;
    let stream: MediaStream | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let currentBlobUrl: string | undefined;

    const stopStream = () => {
      if (!stream) return;
      stream.getTracks().forEach((t) => t.stop());
      stream = null;
    };

    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        if (disposedRef.current) {
          stopStream();
          return;
        }

        const video = videoRef.current;
        if (!video) {
          throw new Error("video element not mounted");
        }
        video.srcObject = stream;
        await video.play();

        const segmenter = await getSegmenter();
        if (disposedRef.current) return;

        // Output canvas dims match the card aspect ratio (733:1024), so the
        // portrait-slot insets map 1:1 onto the real portrait when CSS
        // cover-fits this mask on the .holographic-card surface.
        const maskH = MASK_MAX_EDGE;
        const maskW = Math.round((MASK_MAX_EDGE * CARD_W) / CARD_H);

        const slotX = Math.round(maskW * SLOT_LEFT);
        const slotY = Math.round(maskH * SLOT_TOP);
        const slotW = Math.round(maskW * (1 - SLOT_LEFT - SLOT_RIGHT));
        const slotH = Math.round(maskH * (1 - SLOT_TOP - SLOT_BOTTOM));

        const outCanvas = document.createElement("canvas");
        outCanvas.width = maskW;
        outCanvas.height = maskH;
        const outCtx = outCanvas.getContext("2d");

        const frameCanvas = document.createElement("canvas");
        // willReadFrequently: the ML pipeline repeatedly calls getImageData on
        // this canvas. Without the hint, Chrome logs a perf warning and may
        // keep the canvas on the GPU (which makes readbacks slow).
        const frameCtx = frameCanvas.getContext("2d", { willReadFrequently: true });

        // Silhouette canvas — used every tick to re-tint the bg-removal
        // result for the punch-out and edge-glow passes.
        const silhouetteCanvas = document.createElement("canvas");
        const silhouetteCtx = silhouetteCanvas.getContext("2d");

        // Stripe pattern is static — paint it once at slot resolution and
        // drawImage it into place each tick.
        const stripeCanvas = document.createElement("canvas");
        stripeCanvas.width = slotW;
        stripeCanvas.height = slotH;

        if (!outCtx || !frameCtx || !silhouetteCtx) {
          throw new Error("2D canvas context unavailable");
        }

        paintStripePattern(stripeCanvas);

        const intervalMs = 1000 / fps;

        const scheduleNext = (delay: number) => {
          if (disposedRef.current) return;
          timeoutId = setTimeout(tick, delay);
        };

        const tick = async () => {
          if (disposedRef.current) return;
          const started = performance.now();

          try {
            const vw = video.videoWidth;
            const vh = video.videoHeight;
            if (!vw || !vh) {
              scheduleNext(intervalMs);
              return;
            }

            frameCanvas.width = vw;
            frameCanvas.height = vh;
            frameCtx.drawImage(video, 0, 0, vw, vh);

            const result = await segmenter(frameCanvas);
            if (disposedRef.current) return;

            const rawImage = unwrapRawImage(result);
            const subjectCanvas = rawImage?.toCanvas?.();
            if (!subjectCanvas) {
              throw new Error("background-removal pipeline returned no canvas");
            }

            const subjectW = subjectCanvas.width;
            const subjectH = subjectCanvas.height;
            // contain-fit: the whole subject stays inside the slot so the
            // head is never cropped by the clip rect.
            const fitScale = Math.min(slotW / subjectW, slotH / subjectH);
            const drawW = subjectW * fitScale;
            const drawH = subjectH * fitScale;
            const dx = slotX + (slotW - drawW) / 2;
            const dy = slotY + (slotH - drawH) / 2;

            // ── 0. Reset output to fully transparent ──────────────────
            outCtx.globalCompositeOperation = "source-over";
            outCtx.clearRect(0, 0, maskW, maskH);

            // ── 1. Clip to the portrait-slot rect ─────────────────────
            //    Everything below is confined to the slot; the rest of
            //    the card surface stays transparent (= no glare).
            outCtx.save();
            outCtx.beginPath();
            outCtx.rect(slotX, slotY, slotW, slotH);
            outCtx.clip();

            // ── 2. Stripe pattern inside the slot ─────────────────────
            outCtx.drawImage(stripeCanvas, slotX, slotY, slotW, slotH);

            // ── 3. Punch the subject silhouette ───────────────────────
            //    Flat-black silhouette preserving the bg-removal alpha,
            //    drawn mirrored to match the selfie-mirror CSS on the
            //    video feed. `destination-out` erases destination alpha
            //    where the source is opaque.
            silhouetteCanvas.width = subjectW;
            silhouetteCanvas.height = subjectH;
            silhouetteCtx.globalCompositeOperation = "source-over";
            silhouetteCtx.clearRect(0, 0, subjectW, subjectH);
            silhouetteCtx.drawImage(subjectCanvas, 0, 0);
            silhouetteCtx.globalCompositeOperation = "source-in";
            silhouetteCtx.fillStyle = "black";
            silhouetteCtx.fillRect(0, 0, subjectW, subjectH);

            outCtx.save();
            outCtx.translate(maskW, 0);
            outCtx.scale(-1, 1);
            outCtx.globalCompositeOperation = "destination-out";
            outCtx.drawImage(silhouetteCanvas, maskW - dx - drawW, dy, drawW, drawH);
            outCtx.restore();
            outCtx.globalCompositeOperation = "source-over";

            // ── 4. Edge glow ──────────────────────────────────────────
            //    Fill white using the subject alpha, then
            //    `destination-out` with the same alpha yields
            //    α' = α(1−α), peaking at α ≈ 0.5 — isolating the
            //    semi-transparent border. Drawn N× with 'lighter' to
            //    amplify from ≈ 0.25 → ≈ 1.0 brightness. Also mirrored.
            silhouetteCtx.globalCompositeOperation = "source-over";
            silhouetteCtx.clearRect(0, 0, subjectW, subjectH);
            silhouetteCtx.drawImage(subjectCanvas, 0, 0);
            silhouetteCtx.globalCompositeOperation = "source-in";
            silhouetteCtx.fillStyle = "white";
            silhouetteCtx.fillRect(0, 0, subjectW, subjectH);
            silhouetteCtx.globalCompositeOperation = "destination-out";
            silhouetteCtx.drawImage(subjectCanvas, 0, 0);

            outCtx.save();
            outCtx.translate(maskW, 0);
            outCtx.scale(-1, 1);
            outCtx.globalCompositeOperation = "lighter";
            Array.from({ length: EDGE_GLOW_PASSES }).forEach(() => {
              outCtx.drawImage(silhouetteCanvas, maskW - dx - drawW, dy, drawW, drawH);
            });
            outCtx.restore();
            outCtx.globalCompositeOperation = "source-over";

            // ── 5. Release slot clip ──────────────────────────────────
            outCtx.restore();

            const blob = await canvasToBlob(outCanvas);
            if (disposedRef.current) return;
            if (!blob) {
              throw new Error("canvas.toBlob returned null");
            }

            const nextUrl = URL.createObjectURL(blob);
            const prevUrl = currentBlobUrl;
            currentBlobUrl = nextUrl;
            if (prevUrl) URL.revokeObjectURL(prevUrl);
            setMaskCssValue(`url('${nextUrl}')`);
            setReady(true);
          } catch (loopErr) {
            if (disposedRef.current) return;
            setError(loopErr instanceof Error ? loopErr.message : String(loopErr));
          }

          const elapsed = performance.now() - started;
          scheduleNext(Math.max(0, intervalMs - elapsed));
        };

        scheduleNext(0);
      } catch (startErr) {
        if (disposedRef.current) return;
        setError(startErr instanceof Error ? startErr.message : String(startErr));
      }
    };

    start();

    return () => {
      disposedRef.current = true;
      if (timeoutId !== null) clearTimeout(timeoutId);
      stopStream();
      const video = videoRef.current;
      if (video) video.srcObject = null;
      if (currentBlobUrl) URL.revokeObjectURL(currentBlobUrl);
    };
  }, [fps, videoRef]);

  return { maskCssValue, error, ready };
}
