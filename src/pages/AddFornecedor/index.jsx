import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import {
  Container,
  Title,
  Form,
  Input,
  Button,
  Label,
  Message, // importe o Message
} from '../AddFornecedor/styles';

const AddFornecedor = () => {
  const [cnpjFornecedor, setCnpjFornecedor] = useState("");
  const [nomeSocialFornecedor, setNomeSocialFornecedor] = useState("");
  const [celularFornecedor, setCelularFornecedor] = useState("");
  const [emailFornecedor, setEmailFornecedor] = useState("");
  const [chavePixFornecedor, setChavePixFornecedor] = useState("");
  const [hasPermission, setHasPermission] = useState(false);
  const [message, setMessage] = useState("");      // mensagem a exibir
  const [messageType, setMessageType] = useState(""); // tipo da mensagem: error, success, info
  const navigate = useNavigate();

  useEffect(() => {
    const verificarPermissao = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessageType("error");
        setMessage("Você precisa estar logado!");
        setTimeout(() => navigate("/auth/login"), 2000);
        return;
      }

      const decoded = jwtDecode(token);
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
          (perm) => perm.tela === "Tela de Fornecedores"
        );

        const permissoes = permissoesTela?.permissoes || [];
        const hasPutPermission = permissoes.includes("POST");

        setHasPermission(hasPutPermission);

        if (!hasPutPermission) {
          setMessageType("error");
          setMessage("Você não tem permissão para acessar esta página.");
          setTimeout(() => navigate("/nao-autorizado"), 2000);
        }
      } catch (error) {
        console.error("Erro ao verificar permissões:", error);
        setMessageType("error");
        setMessage("Erro ao verificar permissões.");
        setTimeout(() => navigate("/nao-autorizado"), 2000);
      }
    };

    verificarPermissao();
  }, [navigate]);

  const clearMessageAfterDelay = (delay = 4000) => {
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, delay);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cnpjFornecedor || !nomeSocialFornecedor || !celularFornecedor || !emailFornecedor || !chavePixFornecedor) {
      setMessageType("error");
      setMessage("Por favor, preencha todos os campos.");
      clearMessageAfterDelay();
      return;
    }

    if (!hasPermission) {
      setMessageType("error");
      setMessage("Você não tem permissão para adicionar fornecedores.");
      clearMessageAfterDelay();
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
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        setMessageType("error");
        setMessage("Token expirado. Faça login novamente.");
        localStorage.removeItem("token");
        setTimeout(() => navigate("/auth/login"), 2000);
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
        setMessageType("success");
        setMessage("Fornecedor adicionado com sucesso!");
        setTimeout(() => {
          setMessage("");
          setMessageType("");
          navigate("/fornecedores");
        }, 1500);
      }
    } catch (error) {
      console.error("Erro ao adicionar o fornecedor:", error);

      if (error.response) {
        switch (error.response.status) {
          case 409:
            setMessageType("error");
            setMessage("Erro: O Fornecedor já está cadastrado no sistema.");
            break;
          case 401:
            setMessageType("error");
            setMessage("Token inválido ou expirado. Faça login novamente.");
            localStorage.removeItem("token");
            setTimeout(() => navigate("/auth/login"), 2000);
            break;
          case 500:
            setMessageType("error");
            setMessage("Erro interno do servidor. Tente novamente mais tarde.");
            break;
          default:
            setMessageType("error");
            setMessage("Erro ao adicionar o fornecedor: " + error.response.data);
        }
      } else {
        setMessageType("error");
        setMessage("Erro ao se comunicar com o servidor.");
      }
      clearMessageAfterDelay();
    }
  };

  return (
    <Container>
      <Title>Adicionar Fornecedor</Title>
      {message && <Message type={messageType}>{message}</Message>}
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
