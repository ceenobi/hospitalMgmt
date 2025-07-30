import { useAuthToken } from "@/context";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export function Component() {
  const navigate = useNavigate();
  const { user, accessToken } = useAuthToken();

  useEffect(() => {
    if (!accessToken || !user) {
      navigate("/account/signin");
    }
  }, [navigate, accessToken, user]);

  return null;
}

Component.displayName = "Logout";
