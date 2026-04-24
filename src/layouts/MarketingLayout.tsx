import { Outlet } from "react-router-dom";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export default function MarketingLayout() {
  return (
    <>
      <MarketingNavbar />
      <div className="flex min-h-screen flex-col bg-transparent">
        <main className="flex-1 bg-background">
          <Outlet />
        </main>
        <MarketingFooter />
      </div>
    </>
  );
}
