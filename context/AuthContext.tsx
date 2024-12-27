import React, { createContext, useContext, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

export type LoginType = {
  username: string;
  password: string;
};

interface ProviderProps {
  isAuthenticated: boolean;
  login(data: LoginType): void;
  logout(): void;
}

const AuthContext = createContext<ProviderProps>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const storedInfo = SecureStore.getItem("user") ? true : false;
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(storedInfo);

  const login = (data: LoginType) => {
    SecureStore.setItem("user", JSON.stringify({ ...data }));
    setIsAuthenticated(true);
    router.push("/");
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("user");
    setIsAuthenticated(false);
    router.push("/sign-in");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
