import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Logo } from "@/components/kit/Logo";
import { TemplateRenderer } from "@/components/templates/TemplateRenderer";
import { getKitPageBySlug, type KitPageData } from "@/store/kitPage";
import { Skeleton } from "@/components/ui/skeleton";
import { isSlugRegistered } from "@/lib/registeredSlugs";
import { SlugNotFound } from "@/components/public/SlugNotFound";

export default function PublicKitPage() {
  const { slug } = useParams();
  const [data, setData] = useState<KitPageData | null | undefined>(undefined);

  useEffect(() => {
    const t = window.setTimeout(() => {
      // Strict allowlist check — unregistered slugs render the claim CTA
      if (!isSlugRegistered(slug)) {
        setData(null);
        return;
      }
      const found = getKitPageBySlug(slug);
      setData(found);
      const beacon = window.setTimeout(() => {
        // eslint-disable-next-line no-console
        console.log("[kp:beacon]", { slug, ts: Date.now() });
      }, 8000);
      return () => window.clearTimeout(beacon);
    }, 600);
    return () => window.clearTimeout(t);
  }, [slug]);

  if (data === undefined) return <KitPageSkeleton />;
  if (!data) return <SlugNotFound slug={slug ?? ""} />;
  if (!data.isActive) return <InactiveKit name={data.displayName} />;

  return <TemplateRenderer data={data} />;
}

function KitPageSkeleton() {
  return (
    <div className="min-h-screen space-y-6 bg-background p-6 sm:p-8 md:p-16">
      <Skeleton className="mx-auto h-24 w-24 rounded-full" />
      <Skeleton className="mx-auto h-8 w-64" />
      <Skeleton className="mx-auto h-4 w-96" />
      <div className="mx-auto mt-12 grid max-w-3xl gap-3 sm:grid-cols-3">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
      <Skeleton className="mx-auto mt-8 h-32 max-w-3xl" />
    </div>
  );
}

function InactiveKit({ name }: { name: string }) {
  return (
    <div className="grid min-h-screen place-items-center bg-background p-6 text-center">
      <div className="max-w-md">
        <Logo size="lg" />
        <h1 className="kp-display mt-8 text-3xl">This page is paused</h1>
        <p className="mt-3 text-muted-foreground">
          {name} has temporarily disabled their KitPager page.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full border border-border px-5 py-2.5 text-sm hover:bg-surface-2"
        >
          Back to KitPager
        </Link>
      </div>
    </div>
  );
}
