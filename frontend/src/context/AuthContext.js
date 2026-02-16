"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const AuthContext = createContext();

export const backendUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const { data } = await axios.get(backendUrl + "/api/auth/user", {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        if (data.success) {
          setUser(data.data);
        }
      } catch (error) {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(backendUrl + "/api/auth/login", {
        email,
        password,
      });
      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setUser(data.user);
        router.push("/notes");
      }
      return data;
    } catch (error) {
      return error.response?.data || { success: false, error: error.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await axios.post(backendUrl + "/api/auth/register", {
        name,
        email,
        password,
      });
      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setUser(data.user);
        router.push("/notes");
      }
      return data;
    } catch (error) {
      return error.response?.data || { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        checkAuth,
        backendUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
