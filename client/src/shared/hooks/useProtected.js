import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

export const usePublicRoutes = (accessToken) => {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/dashboard";
  useEffect(() => {
    if (accessToken) {
      navigate(from, { replace: true });
    }
  }, [accessToken, from, navigate, location.pathname]);
  return true;
};

export const usePrivateRoutes = (accessToken, user) => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/dashboard";

  useEffect(() => {
    if (!accessToken) {
      navigate(`/account/signin`, {
        state: { from },
        replace: true,
      });
    }
  }, [accessToken, from, navigate]);

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
