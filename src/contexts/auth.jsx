import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Criando o contexto de autenticação
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);

  // Sempre que o token mudar, configura no Axios
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUserData(); // Chama a função para buscar os dados do usuário sempre que o token mudar
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Função para buscar os dados do usuário
  const fetchUserData = async () => {
    try {
      const response = await axios.get("/api/usuario");
      setUser(response.data);
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
    }
  };

  // Função de login
  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  // Função de logout
  const signout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, signout }}>
      {children}
    </AuthContext.Provider>
  );
};
