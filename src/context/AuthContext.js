import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import api, { setAccessToken } from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);   // ✅ NEW — true until bootstrap finishes

  const login = useCallback(async (email, password) => {
    const { data } = await api.post("/api/auth/login", { email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data.user;
  }, []);

  const signup = useCallback(
    async ({ firstName, lastName, email, password }) => {
      const { data } = await api.post("/api/auth/signup", {
        firstName,
        lastName,
        email,
        password,
      });
      setAccessToken(data.accessToken);
      setUser(data.user);
      return data.user;
    },
    []
  );

  const googleLogin = useCallback(async (credential) => {
    const { data } = await api.post("/api/auth/google", { credential });
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/api/auth/logout");
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.get("/api/auth/me");
      setUser(data.user);
      return data.user;
    } catch {
      return null;
    }
  }, []);

  const bootstrap = useCallback(async () => {
    try {
      const { data } = await api.post("/api/auth/refresh");
      setAccessToken(data.accessToken);
      if (data.user) setUser(data.user);
      else {
        const me = await api.get("/api/auth/me");
        setUser(me.data.user);
      }
    } catch {
      setAccessToken(null);
      setUser(null);
    } finally {
      setLoading(false);   // ✅ NEW
    }
  }, []);

  // ✅ NEW — bootstrap on mount if App.jsx doesn't already call it
  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        googleLogin,
        logout,
        bootstrap,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};