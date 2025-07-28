import { useEffect } from "react";
import { useActionData, useNavigate } from "react-router";

export function Component() {
  const navigate = useNavigate();
  const data = useActionData();

  useEffect(() => {
    if (!data) {
      navigate("/account/signin");
    }
  }, [navigate, data]);

  return null;
}

Component.displayName = "Logout";
