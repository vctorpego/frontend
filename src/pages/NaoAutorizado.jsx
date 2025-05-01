import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import axios from "axios";
import styled from "styled-components";

// Estilos inspirados no padrão existente
const Container = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
`;

const Content = styled.div`
  text-align: center;
  background: #fff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 90%;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: bold;
  color: #e53935;  /* Tom vermelho para indicar erro */
  margin-bottom: 16px;
`;

const Message = styled.p`
  font-size: 18px;
  color: #555;
  margin-bottom: 24px;
`;

const Button = styled.button`
  background-color: #1976d2;
  color: #fff;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
  &:hover {
    background-color: #1565c0;
  }
`;

const NaoAutorizado = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Para controlar o carregamento da verificação
  const [error, setError] = useState(false); // Controlar se houve erro na verificação

  // Mapeamento de telas e suas URLs
  const screenMapping = {
    "Tela de Dashboard": "/home",
    "Tela de Produtos": "/produtos",
    "Tela de Fornecedores": "/fornecedores",
    "Tela de Clientes": "/clientes",
    "Tela de Recarga": "/recarga",
    "Tela de Vendas": "/vendas",
    "Tela de Pagamentos": "/pagamentos",
    "Tela de Relatórios": "/relatorios",
    "Tela de Entrada": "/entrada",
    "Tela de Saída": "/saida",
    "Tela de Usuarios": "/usuarios",
  };

  useEffect(() => {
    const verificarPermissao = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth/login");
        return;
      }

      const decoded = jwt_decode(token);
      const userLogin = decoded.sub; // Extrai o ID do usuário do token

      const getRequestConfig = () => ({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      try {
        // Faz a requisição para pegar os dados do usuário
        const response = await axios.get(
          `http://localhost:8080/usuario/id/${userLogin}`,
          getRequestConfig()
        );
        const userId = response.data;

        // Requisição para pegar as permissões do usuário
        const permissionsResponse = await axios.get(
          `http://localhost:8080/permissao/telas/${userId}`,
          getRequestConfig()
        );

        // Verifica as permissões do usuário para cada tela
        const permissoes = permissionsResponse.data;

        // Encontrar a primeira tela com permissão
        const firstAllowedScreen = permissoes.find((perm) =>
          perm.permissoes.includes("GET")
        );

        if (firstAllowedScreen) {
          const screenName = firstAllowedScreen.tela;
          
          // Normaliza o nome da tela e verifica no mapeamento
          const normalizedScreenName = screenName.trim();
          const screenUrl = screenMapping[normalizedScreenName];

          if (screenUrl) {
            // Redireciona para a URL da tela com permissão
            setTimeout(() => {
              navigate(screenUrl);
            }, 4000); // Aguarda 4 segundos para navegar
          } else {
            console.error("URL da tela não encontrada no mapeamento.");
            navigate("/nao-autorizado"); // Página de erro caso não encontre o mapeamento
          }
        } else {
          navigate("/nao-autorizado");
        }
      } catch (error) {
        console.error("Erro ao verificar permissões:", error);
        setError(true);
        navigate("/nao-autorizado");
      } finally {
        setLoading(false); // Marca que a verificação foi concluída
      }
    };

    verificarPermissao();
  }, [navigate]);

  const handleBack = () => {
    window.history.back();
  };

  // Não exibe a tela até a verificação de permissões estar completa
  if (loading) {
    return null;
  }

  return (
    <Container>
      <Content>
        <Title>Acesso Negado</Title>
        <Message>Você não tem permissão para acessar esta página.</Message>
        <Button onClick={handleBack}>Voltar</Button>
      </Content>
    </Container>
  );
};

export default NaoAutorizado;
