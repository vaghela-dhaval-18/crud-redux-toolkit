import React from "react";
import { Route, Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    let  isAuthenticated = localStorage.getItem("loginUserId") == null ? false : true;
  return !isAuthenticated ? <Navigate to="/" /> : children;
};
export default PrivateRoute;
