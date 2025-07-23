import { useEffect, useState } from "react";
import { AuthContext } from "./index";
import { refreshTokenAction } from "@/features/auth/services/actions";
import { useToken } from "@/hooks/useToken";
import { authUser } from "@/features/auth/services/api";

export default function AuthProvider({ children }) {
  const { accessToken, setAccessToken } = useToken();
  const [user, setUser] = useState(null);

  useEffect(() => {
    let cleanupFunc;
    const setup = async () => {
      cleanupFunc = await refreshTokenAction({ accessToken, setAccessToken });
    };
    setup();
    return () => {
      if (cleanupFunc && typeof cleanupFunc === "function") cleanupFunc();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  useEffect(() => {
    async function fetchUser() {
      const response = await authUser(accessToken);
      setUser(response?.data);
      if (!response?.data?.success) {
        await refreshTokenAction({ accessToken, setAccessToken });
      }
    }
    fetchUser();
  }, [accessToken, setAccessToken]);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, user }}>
      {children}
    </AuthContext.Provider>
  );
}
