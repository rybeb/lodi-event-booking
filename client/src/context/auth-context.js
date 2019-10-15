import React, { useState, createContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = props => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const reAuth = (token, userId) => {
    setToken(token);
    setUserId(userId);
  };

  const login = (token, userId, tokenExpiration) => {
    setToken(token);
    setUserId(userId);
    localStorage.lodiToken = token;
    localStorage.lodiUserId = userId;
  };
  const logout = () => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem('lodiToken');
    localStorage.removeItem('lodiUserId');
  };

  return (
    <AuthContext.Provider
      value={{
        token: token,
        userId: userId,
        reAuth: reAuth,
        login: login,
        logout: logout
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
