import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [permissoes, setPermissoes] = useState(() => {
    const stored = localStorage.getItem("permissoes");
    return stored ? JSON.parse(stored) : [];
  });
  const [loadingPermissoes, setLoadingPermissoes] = useState(false);

  useEffect(() => {
    let timer;

    const verifyTokenAndFetch = async () => {
      if (!token) {
        setUser(null);
        setPermissoes([]);
        setLoadingPermissoes(false);
        delete axios.defaults.headers.common["Authorization"];
        return;
      }

      try {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const decoded = jwt_decode(token);
        const now = Date.now() / 1000;

        if (decoded.exp < now) {
          signout();
          return;
        }

        // Agendar logout no tempo restante do token
        const timeout = (decoded.exp - now) * 1000;
        timer = setTimeout(() => {
          signout();
        }, timeout);

        setLoadingPermissoes(true);

        // Buscar dados do usuário e permissões
        await fetchUserData();

        setLoadingPermissoes(false);
      } catch (error) {
        signout();
      }
    };

    verifyTokenAndFetch();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [token]);

  const getRequestConfig = () => {
    if (!token) return {};
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchUserData = async () => {
    try {
      const userLogin = jwt_decode(token);
      setUser(userLogin);

      const response = await axios.get(
        `http://localhost:8080/usuario/id/${userLogin.sub}`,
        getRequestConfig()
      );
      const userId = response.data;

      const permissionsResponse = await axios.get(
        `http://localhost:8080/permissao/telas/${userId}`,
        getRequestConfig()
      );
      const userPermissoes = permissionsResponse.data || [];
      setPermissoes(userPermissoes);
      localStorage.setItem("permissoes", JSON.stringify(userPermissoes));
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
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
    setPermissoes([]);
    setLoadingPermissoes(false);
    localStorage.removeItem("token");
    localStorage.removeItem("permissoes");
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        permissoes,
        loadingPermissoes,
        login,
        signout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
