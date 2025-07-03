import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { ArrowLeft } from 'lucide-react';
import { Container, Title, Form, Input, Button, BackButton, Label ,Message } from "../EditCliente/styles";

const EditCliente = () => {
  const { idCliente } = useParams();
  const [nomeCliente, setNomeCliente] = useState("");
  const [saldoCliente, setSaldoCliente] = useState("");
  const [limiteCliente, setLimiteCliente] = useState("");
  const [dtNascCliente, setDtNascCliente] = useState("");
  const [idCartaoCliente, setIdCartaoCliente] = useState("");
  const [ultimaCompraCliente, setUltimaCompraCliente] = useState("");
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
          (perm) => perm.tela === "Tela de Clientes"
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
    const fetchCliente = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessageType("error");
        setMessage("Voce precisa estar logado!");
        setTimeout(() => navigate("/auth/login"), 2000);
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp < Date.now() / 1000) {
          setMessageType("error");
          setMessage("Token Expirado!");
          localStorage.removeItem("token");
          setTimeout(() => navigate("/auth/login"), 2000);
          return;
        }

        const response = await axios.get(
          `http://localhost:8080/cliente/${idCliente}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const {
          nomeCliente,
          saldoCliente,
          limiteCliente,
          dtNascCliente,
          idCartaoCliente,
          ultimaCompraCliente,
          faturaCliente,
        } = response.data;

        setNomeCliente(nomeCliente);
        setSaldoCliente(saldoCliente);
        setLimiteCliente(limiteCliente);
        setDtNascCliente(dtNascCliente);
        setIdCartaoCliente(idCartaoCliente);
        setUltimaCompraCliente(ultimaCompraCliente);
      } catch (error) {
        console.error("Erro ao buscar o cliente:", error);
        setMessageType("error");
        setMessage("Erro ao carregar Cliente!");
      }
    };

    fetchCliente();
  }, [idCliente, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (
      nomeCliente.trim() === "" ||
      idCartaoCliente.trim() === "" ||
      dtNascCliente.trim() === "" ||
      saldoCliente === "" ||
      limiteCliente === ""
    ) {
      setMessageType("info");
      setMessage("Preencha todos os campos");
      return;
    }
  
    const token = localStorage.getItem("token");
  
    if (!token) {
      setMessageType("error");
      setMessage("Você precisa estar logado!");
      localStorage.removeItem("token");
      setTimeout(() => navigate("/auth/login"), 2000);
      return;
    }
  
    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp < Date.now() / 1000) {
        setMessageType("error");
        setMessage("Token Expirado!");
        localStorage.removeItem("token");
        setTimeout(() => navigate("/auth/login"), 2000);
        return;
      }
  
      await axios.put(
        `http://localhost:8080/cliente/alterar/${idCliente}`,
        {
          nomeCliente,
          saldoCliente: parseFloat(saldoCliente),
          limiteCliente: parseFloat(limiteCliente),
          dtNascCliente,
          idCartaoCliente,
          ultimaCompraCliente,
          faturaCliente: 0,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      setMessageType("success");
      setMessage("Cliente atualizado com successo!");
      setTimeout(() => navigate("/clientes"), 2000);
    } catch (error) {
      console.error("Erro ao atualizar o cliente:", error);
      setMessageType("error");
      setMessage("Erro ao atualizar cliente");

    }
  };
  
  if (!hasPermission) return null;

  return (
    <Container>
      <BackButton onClick={() => navigate("/clientes")}>
        <ArrowLeft size={20} /> Voltar
      </BackButton>
      <Title>Editar Cliente</Title>
      {message && <Message type={messageType}>{message}</Message>}
      <Form onSubmit={handleSubmit}>
        <div>
          <Label>Nome:</Label>
          <Input
            type="text"
            value={nomeCliente}
            onChange={(e) => setNomeCliente(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Saldo:</Label>
          <Input
            type="number"
            value={saldoCliente}
            onChange={(e) => setSaldoCliente(e.target.value)}
            required

          />
        </div>
        <div>
          <Label>Limite de Crédito:</Label>
          <Input
            type="number"
            value={limiteCliente}
            onChange={(e) => setLimiteCliente(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Data de Nascimento:</Label>
          <Input
            type="date"
            value={dtNascCliente}
            onChange={(e) => setDtNascCliente(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Cartão:</Label>
          <Input
            type="text"
            value={idCartaoCliente}
            onChange={(e) => setIdCartaoCliente(e.target.value)}
            required
          />
        </div>

        <Button type="submit">Atualizar Cliente</Button>
      </Form>
    </Container>
  );
};

export default EditCliente;
