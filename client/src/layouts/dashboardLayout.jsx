import Sidebar from "@/shared/components/sidebar";
import { Outlet } from "react-router";
import { usePrivateRoutes } from "@/shared/hooks/useProtected";
import DashboardNav from "@/shared/components/dashboardNav";
import MobileNav from "@/shared/components/mobileNav";

export function Component() {
  usePrivateRoutes();
  return (
    <>
      <section className="min-h-screen">
        <Sidebar />
        <div className="lg:ml-[200px] xl:ml-[240px] flex-1">
          <DashboardNav />
          <MobileNav />
          <Outlet />
        </div>
      </section>
    </>
  );
}

Component.displayName = "DashboardLayout";
