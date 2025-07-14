import { useEffect } from "react";
import { useFetcher, useNavigate, useRouteLoaderData } from "react-router";

export function Component() {
  const user = useRouteLoaderData("auth_user");
  const fetcher = useFetcher();
  const navigate = useNavigate();

  useEffect(() => {
    if (fetcher.data?.success || !user) {
      navigate("/account/signin");
    }
  }, [fetcher.data, navigate, user]);

  return null;
}

Component.displayName = "Logout";
