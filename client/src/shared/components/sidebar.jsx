import {
  dashBoardLinks,
  roleBasedPathPermissions,
} from "@/shared/utils/constants";
import Logo from "./logo";
import { NavLink, useLocation, useRouteLoaderData } from "react-router";
import Logout from "./logout";

export default function Sidebar() {
  const location = useLocation();
  const path = location.pathname;
  const user = useRouteLoaderData("auth_user");
  const roles = ["patient", "doctor", "admin", "nurse", "staff"];
  const userRole = roles.find((role) => role === user?.role);
  const isAuthorized =
    (userRole === "admin" && roleBasedPathPermissions.admin.allowedSubpaths) ||
    (userRole === "doctor" &&
      roleBasedPathPermissions.doctor.allowedSubpaths) ||
    (userRole === "patient" &&
      roleBasedPathPermissions.patient.allowedSubpaths) ||
    (userRole === "nurse" && roleBasedPathPermissions.nurse.allowedSubpaths);

  return (
    <aside className="hidden bg-white lg:block min-h-screen fixed z-50 shadow-xl border-r-[0.2px] border-gray-500 w-[200px] xl:w-[240px]">
      <div className="p-4 border-b-[0.2px] border-gray-500">
        <Logo />
      </div>
      <div className="h-[calc(100vh-150px)] overflow-y-auto">
        {dashBoardLinks.map((item) => (
          <div key={item.id}>
            <p className="font-medium text-gray-500 px-3 py-2">
              {item.title === "Management" && userRole == "patient"
                ? ""
                : item.title}
            </p>
            <div className="flex flex-col">
              {item.children
                .filter((child) => {
                  if (
                    roleBasedPathPermissions[userRole] &&
                    isAuthorized.includes(child.href)
                  ) {
                    return true;
                  }
                  return false;
                })
                .map((child) => (
                  <NavLink
                    to={child.href}
                    key={child.id}
                    className={({ isActive }) =>
                      `hover:text-blue-500 transition-all duration-300 px-4 py-2 flex items-center gap-2 ${
                        isActive ||
                        path.split("/")[2] === child.href.split("/")[2]
                          ? "text-blue-500 border-blue-500 bg-blue-50 font-semibold"
                          : "text-[var(--paint-white)]"
                      }`
                    }
                    viewTransition
                    end
                  >
                    <child.Icon />
                    {child.name}
                  </NavLink>
                ))}
            </div>
          </div>
        ))}
      </div>
      <Logout />
    </aside>
  );
}
