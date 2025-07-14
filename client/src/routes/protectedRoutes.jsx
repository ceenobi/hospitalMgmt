import { useEffect } from "react";
import { useLocation, useNavigate, useRouteLoaderData } from "react-router";

export const PublicRoutes = ({ children }) => {
  const user = useRouteLoaderData("auth_user");
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, from, navigate]);
  return children;
};

export const PrivateRoutes = ({ children }) => {
  const user = useRouteLoaderData("auth_user");
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";
  useEffect(() => {
    if (!user) {
      navigate("/account/signin", { state: { from }, replace: true });
    }
  }, [user, from, navigate]);

  useEffect(() => {
    if (
      user &&
      !user.isVerified &&
      location.pathname !== "/account/verify-account"
    ) {
      navigate("/account/verify-account", {
        state: { from: location },
        replace: true,
      });
    }
  }, [user, from, navigate, location]);

  return children;
};
