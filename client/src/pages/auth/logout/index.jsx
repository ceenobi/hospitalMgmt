import { useEffect } from "react";
import { useActionData, useNavigate, useRouteLoaderData } from "react-router";

export function Component() {
  const user = useRouteLoaderData("auth_user");
  const navigate = useNavigate();
  const data = useActionData();

  console.log(user);

  useEffect(() => {
    if (!user || data) {
      navigate("/account/signin");
    }
  }, [navigate, user, data]);

  return (
    <div>
      <h1>Logout</h1>
    </div>
  )
}

Component.displayName = "Logout";
