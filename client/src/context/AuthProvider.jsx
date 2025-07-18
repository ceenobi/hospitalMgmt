import { useCallback, useEffect, useState } from "react";
import { AuthContext } from "./index";
import { refreshToken } from "@/features/auth/services/api";

export default function AuthProvider({ children }) {
  const [accessToken, setAccessTokenState] = useState(null);

  const setAccessToken = useCallback(
    (token) => {
      setAccessTokenState(token);
    },
    [setAccessTokenState]
  );

  useEffect(() => {
    async function setup() {
      const res = await refreshToken(setAccessToken);
      return res;
    }
    setup();
  }, [setAccessToken]);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}
