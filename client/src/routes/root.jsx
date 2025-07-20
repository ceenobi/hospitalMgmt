import { Outlet, ScrollRestoration } from "react-router";
import { useAuthToken } from "@/context";
import LazyLoader from "@/shared/components/lazyLoader";

export function Component() {
  const { accessToken, setAccessToken, user, isAuthenticating } =
    useAuthToken();

  if (isAuthenticating) {
    return <LazyLoader />;
  }

  return (
    <main>
      <Outlet context={{ accessToken, setAccessToken, user }} />
      <ScrollRestoration />
    </main>
  );
}

Component.displayName = "Root";
