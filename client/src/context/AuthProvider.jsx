import { useEffect, useState } from "react";
import { AuthContext } from ".";
import { refreshTokenAction } from "@/features/auth/services/actions";
import { useToken } from "@/hooks/useToken";
import { authUser } from "@/features/auth/services/api";
import LazyLoader from "@/components/lazyLoader";

export default function AuthProvider({ children }) {
  const { accessToken, setAccessToken } = useToken();
  const [user, setUser] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    if (!accessToken) return;
    async function refresh() {
      setIsAuthenticating(true);
      await refreshTokenAction({ accessToken, setAccessToken });
      setIsAuthenticating(false);
    }
    refresh();
  }, [accessToken, setAccessToken]);

  useEffect(() => {
    if (!accessToken) return;
    async function fetchUser() {
      setIsAuthenticating(true);
      const response = await authUser(accessToken);
      if (response?.success) {
        setUser(response?.data);
        setIsAuthenticating(false);
      } else {
        await refreshTokenAction({ accessToken, setAccessToken });
        setIsAuthenticating(false);
      }
    }
    fetchUser();
  }, [accessToken, setAccessToken]);

  if (isAuthenticating) {
    return <LazyLoader />;
  }

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        user,
        isAuthenticating,
        setIsAuthenticating,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
