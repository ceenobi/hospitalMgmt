import { createContext, useContext } from "react";

export const AuthContext = createContext({});

export const useAuthToken = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthToken must be used within a AuthProvider");
  }
  return context;
};
