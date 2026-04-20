import { Outlet, NavLink, useParams, Navigate } from "react-router-dom";
import { AppPage } from "@/components/app/AppPage";

const TABS = [
  { to: "/app/settings/profile", label: "Profile" },
  { to: "/app/settings/page", label: "Page" },
  { to: "/app/settings/billing", label: "Billing" },
  { to: "/app/settings/security", label: "Security" },
  { to: "/app/settings/notifications", label: "Notifications" },
  { to: "/app/settings/resources", label: "Resources" },
];

import Profile from "./settings/Profile";
import Billing from "./settings/Billing";
import Security from "./settings/Security";
import PageSettings from "./settings/Page";
import Notifications from "./settings/Notifications";
import Resources from "./settings/Resources";

const MAP: Record<string, JSX.Element> = {
  profile: <Profile />,
  billing: <Billing />,
  security: <Security />,
  page: <PageSettings />,
  notifications: <Notifications />,
  resources: <Resources />,
};

export default function Settings() {
  const { section = "" } = useParams();
  const content = MAP[section];
  if (!content) return <Navigate to="/app/settings/profile" replace />;

  return (
    <AppPage>
      <div className="mb-8">
        <h1 className="kp-display text-3xl md:text-4xl">Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">Workspace, page, billing, and security preferences.</p>
      </div>
      <div className="mb-6 -mx-2 flex gap-1 overflow-x-auto pb-2 no-scrollbar">
        {TABS.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            className={({ isActive }) =>
              `whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm transition ${
                isActive ? "bg-foreground text-background" : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
              }`
            }
          >
            {t.label}
          </NavLink>
        ))}
      </div>
      {content}
      <Outlet />
    </AppPage>
  );
}
