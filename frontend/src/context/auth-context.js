import React, { useState, createContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = props => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const login = (token, userId, tokenExpiration) => {
    setToken(token);
    setUserId(userId);
  };
  const logout = () => {
    setToken(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token: token,
        userId: userId,
        login: login,
        logout: logout
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
