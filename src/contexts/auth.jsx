// src/contexts/auth.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Criando o contexto de autenticação
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Sempre que o token mudar, configura no Axios
  useEffect(() => {
    if (token) {
      // Configura o token nas requisições
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      // Caso o token não exista, não configura o cabeçalho
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Função de login, que define o token
  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  // Função de logout, que limpa o token
  const signout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, login, signout }}>
      {children}
    </AuthContext.Provider>
  );
};
