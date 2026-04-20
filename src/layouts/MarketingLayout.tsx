import { Outlet } from "react-router-dom";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export default function MarketingLayout() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNavbar />
      <main className="pt-6">
        <Outlet />
      </main>
      <MarketingFooter />
    </div>
  );
}
