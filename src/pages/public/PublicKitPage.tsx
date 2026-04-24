import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { Logo } from "@/components/kit/Logo";
import { TemplateRenderer } from "@/components/templates/TemplateRenderer";
import { getKitPageBySlug, type KitPageData } from "@/store/kitPage";
import { Skeleton } from "@/components/ui/skeleton";
import { isSlugRegistered } from "@/lib/registeredSlugs";
import { SlugNotFound } from "@/components/public/SlugNotFound";
import ReviewSubmission from "@/pages/public/ReviewSubmission";
import PrivateShare from "@/pages/public/PrivateShare";
import ReportPage from "@/pages/public/ReportPage";
import Brand from "@/components/marketing/Brand";

export default function PublicKitPage() {
  const { slug, "*": restPath } = useParams();
  const location = useLocation();
  
  // Parse the sub-path
  const segments = restPath ? restPath.split('/').filter(Boolean) : [];
  const [subRoute, ...subParams] = segments;

  // Handle specific sub-routes
  if (subRoute === 'review') {
    // For /:slug/review
    return <ReviewSubmission />;
  }

  if (subRoute === 'share' && subParams[0]) {
    // For /:slug/share/:token
    return <PrivateShare />;
  }

  if (subRoute === 'watch' && subParams.length >= 2) {
    // For /:slug/watch/:period/:id
    return <ReportPage />;
  }

  // Handle any other sub-routes or the main slug page
  if (subRoute) {
    // If there's a sub-route we don't recognize, show 404 or handle accordingly
    console.log(`Unknown sub-route: ${subRoute}`, subParams);
    // You might want to return a 404 component here
    // return <NotFound />;
  }

  // Original main slug page logic
  return <MainKitPage slug={slug || ""} />;
}

// Extracted main kit page logic
function MainKitPage({ slug }: { slug: string }) {
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

  console.log(data);

  if (data === undefined) return <KitPageSkeleton />;
  if (!data) return <SlugNotFound slug={slug} />;
  if (!data.isActive) return <InactiveKit name={data.displayName} />;

return (
  <>
    <TemplateRenderer data={data} />

    <footer className="fixed bottom-6 right-0 -translate-x-1/2 z-20 
      max-w-2xl 
      px-8 py-4 text-center
      rounded-full
      backdrop-blur-md bg-black/50 
      border border-white/20
      shadow-lg">

      <p className="text-[13px] flex items-center justify-center tracking-widest text-white/80">
        Created with 
        <Brand className="pl-2 text-[11px] lowercase" />
        <span className="text-[10px] ml-1 font-bold text-white lowercase">.pro</span>
      </p>

    </footer>
  </>
);
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