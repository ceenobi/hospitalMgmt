import { useEffect } from "react";
import { useLocation, useNavigate, useRouteLoaderData } from "react-router";

export const usePublicRoutes = () => {
  const user = useRouteLoaderData("auth_user");
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { state: { from }, replace: true });
    }
  }, [user, from, navigate]);
  return true;
};

export const usePrivateRoutes = () => {
  const user = useRouteLoaderData("auth_user");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/dashboard";
  
  useEffect(() => {
    if (!user) {
      navigate(`/account/signin`, {
        state: { from },
        replace: true,
      });
    }
  }, [user, from, navigate]);

  useEffect(() => {
    if (user && !user.isVerified && location.pathname !== "/verify-account") {
      navigate("/verify-account", {
        state: { from: location },
        replace: true,
      });
    }
  }, [user, from, navigate, location]);

  useEffect(() => {
    if (
      user &&
      user.isVerified &&
      user.role === "patient" &&
      !user?.isCompletedOnboard &&
      location.pathname !== "/patients-onboard"
    ) {
      navigate("/patients-onboard", {
        state: { from: location },
        replace: true,
      });
    }
  }, [user, from, navigate, location]);

  return true;
};
