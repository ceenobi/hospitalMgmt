import { Outlet, ScrollRestoration } from "react-router";
import { Toaster } from "sonner";
import { useEffect, useState } from "react";
import { useAuthToken } from "@/context";
import { authUser } from "@/features/auth/services/api";

export function Component() {
  const { accessToken, setAccessToken } = useAuthToken();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const response = await authUser(accessToken);
      setUser(response?.data);
    }
    fetchUser();
  }, [accessToken]);

  return (
    <main>
      <Toaster richColors position="top-center" />
      <Outlet context={{ accessToken, setAccessToken, user }} />
      <ScrollRestoration />
    </main>
  );
}

Component.displayName = "Root";
