import { useEffect, useState } from "react";

export function useToken() {
  const [accessToken, setAccessToken] = useState(() => {
    const persistedState = localStorage.getItem("clinicareAccessToken");
    return persistedState ? persistedState : "";
  });

  useEffect(() => {
    localStorage.setItem("clinicareAccessToken", accessToken);
  }, [accessToken]);

  return { accessToken, setAccessToken };
}

