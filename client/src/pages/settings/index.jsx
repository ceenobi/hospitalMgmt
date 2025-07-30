import { PageWrapper } from "@/components/pageWrapper";
import useMetaArgs from "@/hooks/useMeta";
import { settingsLink } from "@/utils/constants";
import { useEffect } from "react";
import {
  NavLink,
  Outlet,
  useFetcher,
  useNavigate,
  useLocation,
  useOutletContext,
} from "react-router";

export function Component() {
  useMetaArgs({
    title: "Settings - Clinicare",
    description: "Manage your account settings.",
    keywords: "Clinicare, settings, account",
  });
  const { user } = useOutletContext();
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const location = useLocation();
  const isSubmitting = fetcher.state === "submitting";

  useEffect(() => {
    location.pathname === "/dashboard/settings" &&
      navigate("/dashboard/settings/account");
  }, [location.pathname, navigate]);

  return (
    <PageWrapper>
      <div className="md:flex justify-between items-center">
        <div>
          <h1 className="font-bold text-2xl">Settings</h1>
          <p className="text-gray-500">Manage your account settings</p>
        </div>
        <div className="hidden md:flex gap-4 justify-end">
          <button
            type="button"
            className="btn btn-outline w-[140px] border border-gray-300"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>
          <button
            type="submit"
            form={location.pathname}
            className="bg-blue-500 text-white font-bold border border-gray-300 p-2 rounded-md cursor-pointer w-[140px]"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
      <div className="my-4 bg-white rounded-xl border border-slate-200 md:grid grid-cols-12">
        <div className="col-span-2 border-r border-slate-200 p-4">
          <div className="flex flex-col">
            {settingsLink
              .filter((child) =>
                child.id === "health" ? user?.role === "patient" : true
              )
              .map((child) => (
                <NavLink
                  to={child.href}
                  key={child.id}
                  className={({ isActive }) =>
                    `hover:text-blue-500 transition-all duration-300 px-4 py-2 flex items-center gap-2 ${
                      isActive
                        ? "text-blue-500 border-blue-500 bg-blue-50 rounded-full"
                        : "text-muted-foreground"
                    }`
                  }
                  viewTransition
                >
                  {child.name}
                </NavLink>
              ))}
          </div>
        </div>
        <div className="col-span-10 py-8 px-4">
          <Outlet context={{ user }} />
        </div>
      </div>
    </PageWrapper>
  );
}

Component.displayName = "Settings";
