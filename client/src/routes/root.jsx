import { Outlet, ScrollRestoration } from "react-router";
import { Toaster } from "sonner";

export function Component() {
  return (
    <main>
      <Toaster richColors position="top-center" />
      <Outlet />
      <ScrollRestoration />
    </main>
  );
}

Component.displayName = "Root";
