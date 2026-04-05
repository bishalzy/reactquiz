
import React from "react";
import Unauthorized from "./Unauthorized";


const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("github_token");

  if (!isAuthenticated) {
    return <Unauthorized />;
  }

  return <>{children}</>;
};

export default AuthGuard;

