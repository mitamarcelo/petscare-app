import React from "react";
import { useAuthenticationContext } from "@/context/AuthenticationContext";
import Header from "@/components/Header";

const Layout = ({ children }: React.PropsWithChildren) => {
  const { isAuthenticated } = useAuthenticationContext();

  return isAuthenticated ? (
    <>
      <Header></Header>
      {children}
    </>
  ) : (
    <>{children}</>
  );
};

export default Layout;
