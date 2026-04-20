interface ImagePlaceholderProps {
  /** Aspect ratio shorthand for sizing the placeholder block. Use width/height to override. */
  aspect?: "square" | "video" | "portrait" | "landscape" | "wide";
  /** CSS classes for additional sizing/positioning. */
  className?: string;
  /** Spec lines that will appear inside the placeholder so the user knows exactly what to generate. */
  title: string;
  dimensions: string;        // e.g. "1600x1000"
  orientation: string;       // "landscape" | "portrait" | "square"
  description: string;       // What the image / animation should be
  background?: string;       // background style description
  facesAllowed?: boolean;
  usage?: string;            // where this image lives in the product
  format?: string;           // png/jpg/svg/gif/lottie
}

const ASPECT: Record<NonNullable<ImagePlaceholderProps["aspect"]>, string> = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
  landscape: "aspect-[16/10]",
  wide: "aspect-[21/9]",
};

/**
 * Renders a clearly-marked placeholder block where a brand image / animation will eventually live.
 * The full IMAGE SPEC is rendered inside the block AND emitted as a JSX comment so the user
 * can grep for it when generating assets.
 *
 * IMPORTANT: every IMAGE SPEC must include orientation, dimensions, content description,
 * background, faces policy, intended usage and format.
 */
export function ImagePlaceholder({
  aspect = "landscape",
  className = "",
  title,
  dimensions,
  orientation,
  description,
  background = "warm neutral, soft shadow, brand-safe",
  facesAllowed = false,
  usage = "—",
  format = "png or jpg",
}: ImagePlaceholderProps) {
  return (
    <div
      className={`kp-image-placeholder ${ASPECT[aspect]} ${className}`}
      data-image-placeholder
      data-image-spec-title={title}
      data-image-spec-dimensions={dimensions}
    >
      <div className="absolute inset-0 flex flex-col gap-3 p-6 md:p-8">
        <div className="flex items-center justify-between">
          <span className="kp-eyebrow">IMAGE SPEC</span>
          <span className="kp-mono text-xs text-muted-foreground">{dimensions}</span>
        </div>
        <div className="flex flex-1 flex-col justify-center">
          <h4 className="kp-display text-2xl text-foreground md:text-3xl">{title}</h4>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">{description}</p>
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-muted-foreground md:grid-cols-3">
          <Spec k="Orientation" v={orientation} />
          <Spec k="Background" v={background} />
          <Spec k="Faces" v={facesAllowed ? "Allowed" : "Not allowed"} />
          <Spec k="Usage" v={usage} />
          <Spec k="Format" v={format} />
        </dl>
      </div>
    </div>
  );
}

function Spec({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex flex-col">
      <dt className="uppercase tracking-[0.12em] text-[10px] text-muted-foreground/70">{k}</dt>
      <dd className="text-foreground/80">{v}</dd>
    </div>
  );
}
