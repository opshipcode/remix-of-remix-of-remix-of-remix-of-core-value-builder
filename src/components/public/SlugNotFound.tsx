import { Link } from "react-router-dom";
import { Logo } from "@/components/kit/Logo";
import { ArrowRight } from "lucide-react";

interface SlugNotFoundProps {
  slug: string;
}

export function SlugNotFound({ slug }: SlugNotFoundProps) {
  return (
    <div className="grid min-h-screen place-items-center bg-background px-6 py-12">
      <div className="w-full max-w-xl text-center">
        <div className="mx-auto inline-flex">
          <Logo size="lg" />
        </div>

        <h1 className="kp-display mt-8 text-3xl sm:text-4xl">
          This page doesn't exist yet.
        </h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Are you a creator? Claim{" "}
          <span className="kp-mono text-foreground">kitpager.pro/{slug}</span>{" "}
          before someone else does.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            to={`/signup?slug=${encodeURIComponent(slug)}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover sm:w-auto"
          >
            Claim /{slug} free
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/login"
            className="text-sm text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
          >
            Already have an account? Sign in →
          </Link>
        </div>

        {/* Blurred preview teaser */}
        <div className="relative mt-12 overflow-hidden rounded-3xl border border-border bg-surface">
          <div
            className="pointer-events-none p-6 opacity-60 blur-sm"
            aria-hidden="true"
          >
            <div className="mx-auto h-20 w-20 rounded-full bg-foreground/10" />
            <div className="mx-auto mt-4 h-5 w-44 rounded bg-foreground/15" />
            <div className="mx-auto mt-2 h-3 w-64 rounded bg-foreground/10" />
            <div className="mx-auto mt-6 grid max-w-md grid-cols-3 gap-2">
              <div className="h-12 rounded-xl bg-foreground/10" />
              <div className="h-12 rounded-xl bg-foreground/10" />
              <div className="h-12 rounded-xl bg-foreground/10" />
            </div>
            <div className="mx-auto mt-4 grid max-w-md grid-cols-2 gap-2">
              <div className="h-20 rounded-xl bg-foreground/10" />
              <div className="h-20 rounded-xl bg-foreground/10" />
            </div>
          </div>
          <div className="absolute inset-0 grid place-items-end bg-gradient-to-t from-background via-background/60 to-transparent p-4">
            <p className="text-xs text-muted-foreground">
              Preview of a Minimal kit page
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
