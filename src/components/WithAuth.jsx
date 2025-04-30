import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const WithAuth = (WrappedComponent) => {
  return (props) => {
    const history = useHistory();
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

    useEffect(() => {
      if (!isAuthenticated) {
        history.push("/login");
      }
    }, [isAuthenticated, history]);

    return <WrappedComponent {...props} />;
  };
};

export default WithAuth;
