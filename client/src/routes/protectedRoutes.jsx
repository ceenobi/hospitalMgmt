import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

export const PublicRoutes = ({ children, accessToken, user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/dashboard";
  useEffect(() => {
    if (accessToken && user) {
      navigate(from, { replace: true });
    }
  }, [accessToken, from, navigate, location.pathname, user]);
  return children;
};

export const PrivateRoutes = ({ children, accessToken, user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/dashboard";

  useEffect(() => {
    if (!accessToken || !user) {
      navigate("/account/signin", { state: { from }, replace: true });
    }
  }, [accessToken, from, navigate, user]);

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

  return children;
};
