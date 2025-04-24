import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import useAuth from "../../hooks/useAuth";
import jwt_decode from "jwt-decode";
import * as C from "./styles";

const Home = () => {
  const { signout } = useAuth();
  const navigate = useNavigate();

  // Função para verificar o token
  const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth/login");
      return null;
    }

    try {
      const decoded = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        localStorage.removeItem("token");
        navigate("/auth/login");
        return null;
      }
    } catch (error) {
      console.error("Erro ao decodificar o token:", error);
      localStorage.removeItem("token");
      navigate("/auth/login");
      return null;
    }

    return token;
  };

  // UseEffect para verificar o token ao carregar a página
  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/auth/login");
    }
  }, [navigate]);

  return (
    <C.Container>
      <C.Title>Home</C.Title>
      <Button Text="Sair" onClick={() => [signout(), navigate("/auth/login")]}>
        Sair
      </Button>
    </C.Container>
  );
};

export default Home;
