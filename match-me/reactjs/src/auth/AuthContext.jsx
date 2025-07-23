import { createContext, useContext, useState, useEffect } from "react";
import { setAccessToken as setApiAccessToken } from "./apiCall";

// Create AuthContext
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let called = false;

    const refresh = async () => {
      if (called) return;
      called = true;

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {
            method: "POST",
            credentials: "include",
          }
        );
        // const res = await fetch(
        //   `${import.meta.env.VITE_API_URL}/auth/refresh`,
        //   {
        //     method: "POST",
        //     credentials: "include",
        //   }
        // );

        if (res.ok) {
          const data = await res.json();
          console.log("REFRESH OK", data);
          setAccessToken(data.accessToken);
          setApiAccessToken(data.accessToken);
        } else if (res.status === 403) {
          console.info("refreshToken not found, skipping silent login.");
        } else {
          console.warn("Unexpected refresh error:", res.status);
        }
      } catch (err) {
        console.error("Silent refresh error:", err);
      } finally {
        setLoading(false);
      }
    };

    refresh();
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
