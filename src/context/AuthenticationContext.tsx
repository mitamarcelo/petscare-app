import React, { useContext, useEffect, useState } from "react";
import { useApplicationContext } from "@/context";
import jwt_decode from "jwt-decode";

import localStorageConstants from "@/constants/localStorage";
import useToastify from "@/hooks/useToastify";

export type LoginProps = {
  email: string;
  password: string;
};

type UserType = {
  user: User;
  exp: number;
};

type User = {
  email: string;
  name: string;
};

type AuthenticationContextType = {
  login: (_loginParams: LoginProps) => void;
  user?: User;
  logout: () => void;
  prevRoute: string;
  setPrevRouter: React.Dispatch<React.SetStateAction<string>>;
  isAuthenticated: boolean;
  getToken: () => string | null;
  contextLogout: () => void;
};

export const AuthenticationContext =
  React.createContext<AuthenticationContextType>({
    login: (_loginParams: LoginProps) => {
      return;
    },
    logout: () => {
      return;
    },
    prevRoute: "",
    setPrevRouter: () => {
      return;
    },
    isAuthenticated: false,
    getToken: () => null,
    contextLogout: () => {
      return;
    },
  });

const AuthenticationProvider = ({ children }: React.PropsWithChildren) => {
  const { axiosClient, setAxiosToken } = useApplicationContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [prevRoute, setPrevRouter] = useState("/");
  const [user, setUser] = useState<User | undefined>(undefined);
  const { success, error } = useToastify();

  useEffect(() => {
    getAuthentication();
    window.addEventListener("storage", getAuthentication, false);
  }, []);

  useEffect(() => {
    if (isAuthenticated) setUser(getUser());
  }, [isAuthenticated]);

  const getToken = () =>
    localStorage.getItem(localStorageConstants.accessToken);

  const getAuthentication = () => {
    const token = getToken();
    setAxiosToken(token || "");
    setIsAuthenticated(!!token && token.length > 0);
  };

  const getUser = () => {
    const token = getToken();
    const jwt = token?.split(" ")[1];
    if (!jwt) return undefined;
    const decodedJWT = jwt_decode<UserType>(jwt);
    return { ...decodedJWT.user };
  };

  const login = (loginParams: LoginProps) => {
    axiosClient
      .post("/login", loginParams)
      .then((response) => {
        const token = response.headers.authorization || "";
        localStorage.setItem(localStorageConstants.accessToken, token);
        setIsAuthenticated(true);
        setAxiosToken(token);
        success("Usuário autenticado!");
      })
      .catch(({ response }) => {
        error(response.data.details.join("\n"));
      });
  };

  const contextLogout = () => {
    localStorage.removeItem(localStorageConstants.accessToken);
    setIsAuthenticated(false);
    setPrevRouter("/");
  };

  const logout = async () => {
    const response = await axiosClient.delete("/logout");
    if (response.status === 204) {
      success("Usuário deslogado");
    } else {
      error(response.data.detail);
    }
    contextLogout();
  };

  return (
    <AuthenticationContext.Provider
      value={{
        login,
        user,
        logout,
        prevRoute,
        setPrevRouter,
        isAuthenticated,
        getToken,
        contextLogout,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

export const useAuthenticationContext = () => {
  return useContext(AuthenticationContext);
};

export default AuthenticationProvider;
