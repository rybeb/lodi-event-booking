import React, { useState, createContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = props => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  const reAuth = (token, userId) => {
    setToken(token);
    setUserId(userId);
  };

  const setEmail = email => {
    setUserEmail(email);
    localStorage.lodiUserEmail = email;
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
    setUserEmail(null);
    localStorage.removeItem('lodiToken');
    localStorage.removeItem('lodiUserId');
    localStorage.removeItem('lodiUserEmail');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        userId,
        userEmail,
        reAuth,
        setEmail,
        login,
        logout
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
