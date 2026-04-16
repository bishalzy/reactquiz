
import React from "react";
import Unauthorized from "./Unauthorized";
import Loading from "./Loading";
import useAuth from "../hooks/useAuth";


const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Unauthorized />;
  }

  return <>{children}</>;
};

export default AuthGuard;

