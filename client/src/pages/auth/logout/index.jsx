import { useAuthToken } from "@/context";
import { useEffect } from "react";
import { useActionData, useNavigate } from "react-router";

export function Component() {
  const navigate = useNavigate();
  const data = useActionData();
  const { user } = useAuthToken();

  useEffect(() => {
    if (!data || !user) {
      navigate("/account/signin");
    }
  }, [navigate, data, user]);

  return null;
}

Component.displayName = "Logout";
