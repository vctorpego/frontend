import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUserData();

      // Verifica expiração do token
      try {
        const decoded = jwt_decode(token);
        const now = Date.now() / 1000; // em segundos

        if (decoded.exp < now) {
          signout();
        } else {
          // Opcional: programa um logout automático quando expirar
          const timeout = (decoded.exp - now) * 1000; // ms
          const timer = setTimeout(() => {
            signout();
          }, timeout);

          return () => clearTimeout(timer); // limpa se o token mudar antes do timeout
        }
      } catch (err) {
        signout(); // token inválido
      }
    } else {
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
    }
  }, [token]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get("/api/usuario");
      setUser(response.data);
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
      // Opcional: se falhar, force logout
      signout();
    }
  };

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

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
