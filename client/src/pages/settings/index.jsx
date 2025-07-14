import Container from "@/shared/components/container";
import useMetaArgs from "@/shared/hooks/useMeta";
import { settingsLink } from "@/shared/utils/constants";
import { useEffect } from "react";
import {
  NavLink,
  Outlet,
  useFetcher,
  useNavigate,
  useLocation,
  useRouteLoaderData,
} from "react-router";

export function Component() {
  useMetaArgs({
    title: "Settings - Clinicare",
    description: "Manage your account settings.",
    keywords: "Clinicare, settings, account",
  });
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const location = useLocation();
  const isSubmitting = fetcher.state === "submitting";
  const user = useRouteLoaderData("auth_user");
  
  useEffect(() => {
    location.pathname === "/dashboard/settings" &&
      navigate("/dashboard/settings/account");
  }, [location.pathname, navigate]);

  return (
    <Container>
      <div className="md:flex justify-between items-center">
        <div>
          <h1 className="font-bold text-2xl">Settings</h1>
          <p className="text-gray-500">Manage your account settings</p>
        </div>
        <div className="hidden md:flex gap-4 justify-end">
          <button
            type="button"
            className="btn btn-outline w-[140px] border-[0.2px] border-gray-500"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>
          <button
            type="submit"
            form={location.pathname}
            className="bg-blue-500 text-white font-bold border-[0.2px] border-gray-500 p-2 rounded-md cursor-pointer w-[140px]"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
      <div className="mt-4 rounded-lg border-[0.2px] border-gray-500 md:grid grid-cols-12">
        <div className="col-span-2 border-r-[0.2px] border-gray-500 p-4">
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
                        ? "text-blue-500 border-blue-500 bg-blue-50"
                        : "text-[var(--paint-white)]"
                    }`
                  }
                >
                  {child.name}
                </NavLink>
              ))}
          </div>
        </div>
        <div className="col-span-10 p-4">
          <Outlet />
        </div>
      </div>
    </Container>
  );
}

Component.displayName = "Settings";
