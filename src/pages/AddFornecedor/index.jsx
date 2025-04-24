import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode"; // Importa a biblioteca para decodificar o token
import { Container, Title, Form, Input, Button, Label } from '../AddFornecedor/styles';  

const AddFornecedor = () => {
  const [cnpjFornecedor, setCnpjFornecedor] = useState("");
  const [nomeSocialFornecedor, setNomeSocialFornecedor] = useState("");
  const [celularFornecedor, setCelularFornecedor] = useState("");
  const [emailFornecedor, setEmailFornecedor] = useState("");
  const [chavePixFornecedor, setChavePixFornecedor] = useState("");
  const [hasPermission, setHasPermission] = useState(false); // Para controlar se tem permissão
  const navigate = useNavigate();

  useEffect(() => {
    const verificarPermissao = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Você precisa estar logado!");
        navigate("/auth/login");
        return;
      }

      const decoded = jwtDecode(token);
      const userLogin = decoded.sub; // Extraindo ID do usuário do token

      const getRequestConfig = () => ({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      try {
        // Requisição para buscar as permissões do usuário
        const response = await axios.get(
          `http://localhost:8080/usuario/id/${userLogin}`,
          getRequestConfig()
        );
        const userId = response.data;

        const permissionsResponse = await axios.get(
          `http://localhost:8080/permissao/telas/${userId}`,
          getRequestConfig()
        );

        // Verifica se o usuário tem permissão para "PUT" na tela de "Tela de Fornecedores"
        const permissoesTela = permissionsResponse.data.find(
          (perm) => perm.tela === "Tela de Fornecedores"
        );

        const permissoes = permissoesTela?.permissoes || [];
        const hasPutPermission = permissoes.includes("POST");

        setHasPermission(hasPutPermission);

        // Caso não tenha permissão, redireciona para página de acesso negado
        if (!hasPutPermission) {
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
    console.log("Formulário enviado");

    if (!cnpjFornecedor || !nomeSocialFornecedor || !celularFornecedor || !emailFornecedor || !chavePixFornecedor) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    if (!hasPermission) {
      alert("Você não tem permissão para adicionar fornecedores.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Você precisa estar logado!");
      navigate("/auth/login");
      return;
    }

    try {
      // Decodifica o token para verificar a expiração
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Tempo atual em segundos

      if (decodedToken.exp < currentTime) {
        alert("Token expirado. Faça login novamente.");
        localStorage.removeItem("token");
        navigate("/auth/login");
        return;
      }

      const response = await axios.post(
        "http://localhost:8080/fornecedor",
        {
          cnpjFornecedor,
          nomeSocialFornecedor,
          celularFornecedor,
          emailFornecedor,
          chavePixFornecedor,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Fornecedor adicionado com sucesso!");
        setTimeout(() => {
          navigate("/fornecedores");
        }, 1500);
      }
    } catch (error) {
      console.error("Erro ao adicionar o fornecedor:", error);

      if (error.response) {
        if (error.response.status === 409) {
          alert("Erro: O Fornecedor já está cadastrado no sistema.");
        } else if (error.response.status === 401) {
          alert("Token inválido ou expirado. Faça login novamente.");
          localStorage.removeItem("token");
          navigate("/auth/login");
        } else if (error.response.status === 500) {
          alert("Erro interno do servidor. Tente novamente mais tarde.");
        } else {
          alert("Erro ao adicionar o fornecedor: " + error.response.data);
        }
      } else {
        alert("Erro ao se comunicar com o servidor.");
      }
    }
  };

  return (
    <Container>
      <Title>Adicionar Fornecedor</Title>
      <Form onSubmit={handleSubmit}>
        <div>
          <Label>CNPJ do Fornecedor:</Label>
          <Input
            type="text"
            value={cnpjFornecedor}
            onChange={(e) => setCnpjFornecedor(e.target.value)}
            placeholder="CNPJ do Fornecedor"
            required
          />
        </div>
        <div>
          <Label>Nome Social:</Label>
          <Input
            type="text"
            value={nomeSocialFornecedor}
            onChange={(e) => setNomeSocialFornecedor(e.target.value)}
            placeholder="Nome Social do Fornecedor"
            required
          />
        </div>
        <div>
          <Label>Celular:</Label>
          <Input
            type="text"
            value={celularFornecedor}
            onChange={(e) => setCelularFornecedor(e.target.value)}
            placeholder="Celular do Fornecedor"
            required
          />
        </div>
        <div>
          <Label>Email:</Label>
          <Input
            type="email"
            value={emailFornecedor}
            onChange={(e) => setEmailFornecedor(e.target.value)}
            placeholder="Email do Fornecedor"
            required
          />
        </div>
        <div>
          <Label>Chave Pix:</Label>
          <Input
            type="text"
            value={chavePixFornecedor}
            onChange={(e) => setChavePixFornecedor(e.target.value)}
            placeholder="Chave Pix do Fornecedor"
            required
          />
        </div>
        <Button type="submit" disabled={!hasPermission}>Adicionar Fornecedor</Button>
      </Form>
    </Container>
  );
};

export default AddFornecedor;
