import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api, { setAuthToken } from "../api/axios.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("mygpt_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("mygpt_token"));
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      if (!token) {
        setAuthToken(null);
        setIsBootstrapping(false);
        return;
      }

      try {
        setAuthToken(token);
        const { data } = await api.get("/auth/me");
        setUser(data.user);
        localStorage.setItem("mygpt_user", JSON.stringify(data.user));
      } catch {
        localStorage.removeItem("mygpt_token");
        localStorage.removeItem("mygpt_user");
        setToken(null);
        setUser(null);
        setAuthToken(null);
      } finally {
        setIsBootstrapping(false);
      }
    };

    verifySession();
  }, [token]);

  const saveSession = (data) => {
    localStorage.setItem("mygpt_token", data.token);
    localStorage.setItem("mygpt_user", JSON.stringify(data.user));
    setAuthToken(data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const login = async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    saveSession(data);
  };

  const signup = async (values) => {
    const { data } = await api.post("/auth/signup", values);
    saveSession(data);
  };

  const logout = () => {
    localStorage.removeItem("mygpt_token");
    localStorage.removeItem("mygpt_user");
    setAuthToken(null);
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isBootstrapping,
      login,
      signup,
      logout
    }),
    [user, token, isBootstrapping]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};

