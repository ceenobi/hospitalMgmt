import Sidebar from "@/components/sidebar";
import { Outlet, useOutletContext } from "react-router";
import { usePrivateRoutes } from "@/hooks/useProtected";
import DashboardNav from "@/components/dashboardNav";
import MobileNav from "@/components/mobileNav";

export function Component() {
  const { accessToken, user } = useOutletContext();
  usePrivateRoutes(accessToken, user);

  return (
    <>
      <section className="min-h-screen">
        <Sidebar user={user} />
        <div className="lg:ml-[200px] xl:ml-[240px] flex-1">
          <DashboardNav user={user} />
          <MobileNav user={user} />
          <Outlet context={{ user }} />
        </div>
      </section>
    </>
  );
}

Component.displayName = "DashboardLayout";
