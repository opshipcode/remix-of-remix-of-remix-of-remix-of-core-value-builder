import { Link } from "react-router-dom";
import { Construction } from "lucide-react";

/**
 * Temporary placeholder for routes scaffolded in the spec but not yet implemented in this session.
 * Each route is fully designed and consistent with the design system.
 */
export default function ComingSoon({
  title = "Coming next session",
  route,
  description = "This route is part of the build plan and will be implemented in the next session.",
}: {
  title?: string;
  route?: string;
  description?: string;
}) {
  return (
    <div className="grid min-h-[60vh] place-items-center px-6">
      <div className="kp-card max-w-md p-10 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary-highlight text-primary">
          <Construction className="h-5 w-5" />
        </div>
        <h2 className="kp-display mt-5 text-2xl">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        {route && <p className="kp-mono mt-4 text-xs text-muted-foreground">{route}</p>}
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-full border border-border px-4 py-2 text-sm transition hover:bg-surface-2"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
