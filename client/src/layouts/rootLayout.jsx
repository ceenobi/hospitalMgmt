import Logo from "@/shared/components/logo";
import { RiCopyrightFill } from "@remixicon/react";
import { NavLink, Outlet, useOutletContext } from "react-router";
import { usePublicRoutes } from "@/shared/hooks/useProtected";

export function Component() {
  const { accessToken, user } = useOutletContext();
  usePublicRoutes(accessToken, user);
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-white">
        <div className="container mx-auto py-5 px-4 flex justify-between items-center">
          <Logo />
          <div className="flex gap-4 items-center">
            {["contact"].map((item) => (
              <NavLink
                to={`/${item}`}
                key={item}
                className={({ isActive }) =>
                  `hover:text-blue-500 transition-all duration-300 capitalize font-medium ${
                    isActive ? "text-blue-500" : ""
                  }`
                }
              >
                {item.concat(" ", "Us")}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
      <Outlet context={{ user }} />
      <div className="container mx-auto px-4 py-5">
        <div className="container mx-auto divider"></div>
        <div className="flex gap-1 items-center justify-center md:justify-start">
          <RiCopyrightFill size={18} />
          <span className="text-sm">
            {new Date().getFullYear()} Clinicare. All rights reserved.
          </span>
        </div>
      </div>
    </>
  );
}

Component.displayName = "RootLayout";
