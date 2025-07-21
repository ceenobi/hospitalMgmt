import { Outlet, ScrollRestoration } from "react-router";
import { useAuthToken } from "@/context";

export function Component() {
  const { accessToken, setAccessToken, user } = useAuthToken();

  return (
    <main>
      <Outlet context={{ accessToken, setAccessToken, user }} />
      <ScrollRestoration />
    </main>
  );
}

Component.displayName = "Root";
