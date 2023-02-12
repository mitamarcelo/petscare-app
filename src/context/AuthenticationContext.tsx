import React, { useContext, useEffect, useState } from "react";
import { NextRouter } from "next/router";
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
  const { axiosClient } = useApplicationContext();
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

  const logout = () => {
    axiosClient
      .delete("/logout", {
        headers: { Authorization: getToken() },
      })
      .then((response) => {
        success("Usuário deslogado");
      })
      .catch((err) => {
        debugger;
        if (err.response.status === 401) {
          error("Usuário deslogado");
        } else {
          error(err.response.data.detail);
        }
      })
      .finally(() => {
        contextLogout();
      });
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

export const useAuthenticated = (router: NextRouter) => {
  const { isAuthenticated, setPrevRouter } = useContext(AuthenticationContext);

  useEffect(() => {
    if (!isAuthenticated) {
      let prevPath = router.pathname;
      const routerQuery = router.query;
      Object.keys(routerQuery).forEach((param) => {
        const replacement = routerQuery[param]?.toString() || "";
        prevPath = prevPath.replace(`[${param}]`, replacement);
      });
      if (!!prevPath) setPrevRouter(prevPath);
      router.push("/login");
    }
  }, [isAuthenticated]);
};

export default AuthenticationProvider;
