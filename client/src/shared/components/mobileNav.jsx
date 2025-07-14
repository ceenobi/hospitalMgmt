import { useRouteLoaderData } from "react-router";
import Logo from "./logo";
import Drawer from "./drawer";

export default function MobileNav() {
  const user = useRouteLoaderData("auth_user");
  return (
    <div className="lg:hidden bg-white fixed top-0 right-0 left-0  z-30 shadow">
      <div className="flex justify-between items-center container mx-auto py-[12px] px-4">
        <Logo />
        <Drawer user={user} />
      </div>
    </div>
  );
}
