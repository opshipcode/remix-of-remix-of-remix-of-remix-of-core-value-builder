import { Skeleton } from "@/components/ui/skeleton";

/** A standard skeleton for full app pages: header + grid of cards. */
export function AppPageSkeleton({
  cards = 3,
  withHeader = true,
}: {
  cards?: number;
  withHeader?: boolean;
}) {
  return (
    <div className="px-5 py-6 md:px-8 md:py-8">
      {withHeader && (
        <div className="mb-8 space-y-2">
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: cards }).map((_, i) => (
          <div key={i} className="kp-card space-y-3 p-6">
            <div className="flex items-center justify-between">
              <Skeleton className="h-9 w-9 rounded-xl" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <div className="grid grid-cols-3 gap-3 pt-2">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
