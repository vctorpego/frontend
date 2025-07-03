import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { ArrowLeft } from 'lucide-react';
import {
  Container,
  Title,
  Form,
  Input,
  Button,
  BackButton,
  Label,
  Message,
} from '../EditFornecedor/styles';

const EditFornecedor = () => {
  const { idFornecedor } = useParams(); 
  const [cnpjFornecedor, setCnpjFornecedor] = useState("");
  const [nomeSocialFornecedor, setNomeSocialFornecedor] = useState("");
  const [celularFornecedor, setCelularFornecedor] = useState("");
  const [emailFornecedor, setEmailFornecedor] = useState("");
  const [chavePixFornecedor, setChavePixFornecedor] = useState("");
  const [message, setMessage] = useState("");
  const [hasPermission, setHasPermission] = useState(false);
  const [messageType, setMessageType] = useState("");
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
        const hasPutPermission = permissoes.includes("PUT");

        setHasPermission(hasPutPermission);

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

  useEffect(() => {
    const fetchFornecedor = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessageType("error");
        setMessage("Você precisa estar logado!");
        setTimeout(() => navigate("/auth/login"), 2000);
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp < Date.now() / 1000) {
          setMessageType("error");
          setMessage("Token Expirado !");
          localStorage.removeItem("token");
          setTimeout(() => navigate("/auth/login"), 2000);
          return;
        }

        const response = await axios.get(`http://localhost:8080/fornecedor/${idFornecedor}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { cnpjFornecedor, nomeSocialFornecedor, celularFornecedor, emailFornecedor, chavePixFornecedor } = response.data;
        setCnpjFornecedor(cnpjFornecedor);
        setNomeSocialFornecedor(nomeSocialFornecedor);
        setCelularFornecedor(celularFornecedor);
        setEmailFornecedor(emailFornecedor);
        setChavePixFornecedor(chavePixFornecedor);
      } catch (error) {
        console.error("Erro ao buscar o fornecedor:", error);
        setMessageType("error");
        setMessage("Erro ao Carregar Fornecedor!");
      }
    };
    fetchFornecedor();
  }, [idFornecedor, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cnpjFornecedor || !nomeSocialFornecedor || !celularFornecedor || !emailFornecedor || !chavePixFornecedor) {
      setMessageType("error");
      setMessage("Preencha todos os campos");
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
      if (decodedToken.exp < Date.now() / 1000) {
        setMessageType("error");
        setMessage("Token Expirado !");
        localStorage.removeItem("token");
        setTimeout(() => navigate("/auth/login"), 2000);
        return;
      }

      await axios.put(
        `http://localhost:8080/fornecedor/alterar/${idFornecedor}`,
        {
          cnpjFornecedor,
          nomeSocialFornecedor,
          celularFornecedor,
          emailFornecedor,
          chavePixFornecedor,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessageType("success");
      setMessage("Fornecedor Atualizado com Sucesso !");
      setTimeout(() => navigate("/fornecedores"), 2000);
    } catch (error) {
      console.error("Erro ao atualizar o fornecedor:", error);
      setMessageType("error");
      setMessage("Erro ao Atualizar Fornecedor !");

    }
  };

  if (!hasPermission) {
    return <p>Você não tem permissão para editar fornecedores.</p>;
  }

  return (
    <Container>
      <BackButton onClick={() => navigate("/fornecedores")}>
        <ArrowLeft size={20} /> Voltar
      </BackButton>
      <Title>Editar Fornecedor</Title>
      {message && <Message type={messageType}>{message}</Message>}
      <Form onSubmit={handleSubmit}>
        <div>
          <Label>CNPJ do Fornecedor:</Label>
          <Input
            type="text"
            value={cnpjFornecedor}
            onChange={(e) => setCnpjFornecedor(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Nome Social:</Label>
          <Input
            type="text"
            value={nomeSocialFornecedor}
            onChange={(e) => setNomeSocialFornecedor(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Celular:</Label>
          <Input
            type="text"
            value={celularFornecedor}
            onChange={(e) => setCelularFornecedor(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Email:</Label>
          <Input
            type="email"
            value={emailFornecedor}
            onChange={(e) => setEmailFornecedor(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Chave Pix:</Label>
          <Input
            type="text"
            value={chavePixFornecedor}
            onChange={(e) => setChavePixFornecedor(e.target.value)}
            required
          />
        </div>
        <Button type="submit">Atualizar Fornecedor</Button>
      </Form>
    </Container>
  );
};

export default EditFornecedor;
