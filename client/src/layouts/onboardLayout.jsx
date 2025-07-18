import Logo from "@/shared/components/logo";
import { Form } from "react-router";
import { usePrivateRoutes } from "@/shared/hooks/useProtected";
import { Outlet, useOutletContext } from "react-router";
import { RiCopyrightFill } from "@remixicon/react";

export function Component() {
  const { accessToken, user } = useOutletContext();
  usePrivateRoutes(accessToken, user);
  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="flex justify-between items-center">
        <Logo />
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="btn bg-red-500 hover:bg-red-600 text-white w-fit"
          >
            Logout
          </button>
        </Form>
      </div>
      <Outlet context={{ user }} />
      <div className="flex justify-center md:justify-start items-center text-gray-600">
        <div className="flex gap-1 items-center">
          <RiCopyrightFill size={18} />
          <span className="text-sm">
            {new Date().getFullYear()} Clinicare. All rights reserved.
          </span>
        </div>
      </div>
    </div>
  );
}

Component.displayName = "OnboardLayout";
