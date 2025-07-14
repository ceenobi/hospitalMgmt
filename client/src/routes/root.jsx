import { Outlet, ScrollRestoration, useLoaderData } from "react-router";
import { Toaster } from "sonner";

export function Component() {
  const user = useLoaderData();
  console.log(user);
  return (
    <main>
      <Toaster richColors position="top-center" />
      <Outlet />
      <ScrollRestoration />
    </main>
  );
}

Component.displayName = "Root";
