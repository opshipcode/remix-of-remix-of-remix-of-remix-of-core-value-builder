import { ReactNode } from "react";

/** Standard padded scroll area inside the App shell. */
export function AppPage({ children }: { children: ReactNode }) {
  return <div className="px-4 pt-6 pb-8 sm:px-6 md:px-8 md:py-8">{children}</div>;
}

export function AppHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
      <div>
        <h1 className="kp-display text-3xl md:text-4xl">{title}</h1>
        {description && <p className="mt-2 text-sm text-muted-foreground md:text-base">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
