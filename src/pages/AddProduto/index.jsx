import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { ArrowLeft } from 'lucide-react';
import { Container, Title, Form, Input, Button, BackButton, Label, Message } from '../AddProduto/styles';

const AddProduto = () => {
  const [nomeProduto, setNomeProduto] = useState("");
  const [precoCusto, setPrecoCusto] = useState("");
  const [precoVenda, setPrecoVenda] = useState("");
  const [estoque, setEstoque] = useState("");
  const [hasPermission, setHasPermission] = useState(false);
  const [messageType, setMessageType] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const verificarPermissao = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/auth/login");
        return;
      }

      const decoded = jwt_decode(token);
      const userLogin = decoded.sub;

      const getRequestConfig = () => ({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      try {
        const response = await axios.get(
          `http://localhost:8080/usuario/id/${userLogin}`,
          getRequestConfig()
        );
        const userId = response.data;

        const permissionsResponse = await axios.get(
          `http://localhost:8080/permissao/telas/${userId}`,
          getRequestConfig()
        );

        const permissoesTela = permissionsResponse.data.find(
          (perm) => perm.tela === "Tela de Produtos"
        );

        const permissoes = permissoesTela?.permissoes || [];
        const hasPostPermission = permissoes.includes("POST");

        setHasPermission(hasPostPermission);

        if (!hasPostPermission) {
          navigate("/nao-autorizado");
        }
      } catch (error) {
        console.error("Erro ao verificar permissões:", error);
        navigate("/nao-autorizado");
      }
    };

    verificarPermissao();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hasPermission) {
      setMessageType("error");
      setMessage("Voce não tem permissao de adicionar produto!");
      //setTimeout(() => navigate("/auth/login"), 2000);
      return;
    }

    if (!nomeProduto || !precoCusto || !precoVenda || !estoque) {
      setMessageType("error");
      setMessage("Preencha todos os campos!");

      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setMessageType("error");
      setMessage("Você precisa estar logado!");
      setTimeout(() => navigate("/auth/login"), 2000);
      return;
    }

    try {
      const decodedToken = jwt_decode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        setMessageType("error");
        setMessage("Token Expirado!");
        localStorage.removeItem("token");
        setTimeout(() => navigate("/auth/login"), 2000);

        return;
      }

      const response = await axios.post(
        "http://localhost:8080/produto",
        {
          nomeProduto,
          precoProduto: precoVenda,
          valorDeCustoProduto: precoCusto,
          quantProduto: estoque,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setMessageType("success");
        setMessage("Produto adicionado com Sucesso!");
        setTimeout(() => navigate("/produtos"), 2000);
      }
    } catch (error) {
      console.error("Erro ao adicionar o produto:", error);

      if (error.response) {
        if (error.response.status === 409) {
          setMessageType("error");
          setMessage("Produto já cadastrado no sistema!");
        } else if (error.response.status === 401) {
          setMessageType("error");
          setMessage("Token Expirado!");
          localStorage.removeItem("token");
          setTimeout(() => navigate("/auth/login"), 2000);
        } else if (error.response.status === 500) {
          setMessageType("error");
          setMessage("Erro interno do sistema!");
        } else {
          setMessageType("error");
          setMessage("Erro ao adicionar produto!");
        }
      } else {
        setMessageType("error");
        setMessage("Erro interno do sistema!");
      }
    }
  };

  if (!hasPermission) {
    return <p>Você não tem permissão para adicionar produtos.</p>;
  }

  return (
    <Container>
      <BackButton onClick={() => navigate("/produtos")}>
        <ArrowLeft size={20} /> Voltar
      </BackButton>
      <Title>Adicionar Produto</Title>
      {message && <Message type={messageType}>{message}</Message>}
      <Form onSubmit={handleSubmit}>
        <div>
          <Label>Nome do Produto:</Label>
          <Input
            type="text"
            value={nomeProduto}
            onChange={(e) => setNomeProduto(e.target.value)}
            placeholder="Nome do Produto"
            required
          />
        </div>
        <div>
          <Label>Preço de Custo:</Label>
          <Input
            type="number"
            value={precoCusto}
            onChange={(e) => setPrecoCusto(e.target.value)}
            placeholder="Preço de Custo"
            required
          />
        </div>
        <div>
          <Label>Preço de Venda:</Label>
          <Input
            type="number"
            value={precoVenda}
            onChange={(e) => setPrecoVenda(e.target.value)}
            placeholder="Preço de Venda"
            required
          />
        </div>
        <div>
          <Label>Estoque:</Label>
          <Input
            type="number"
            value={estoque}
            onChange={(e) => setEstoque(e.target.value)}
            placeholder="Quantidade em Estoque"
            required
          />
        </div>
        <Button type="submit">Adicionar Produto</Button>
      </Form>
    </Container>
  );
};

export default AddProduto;
