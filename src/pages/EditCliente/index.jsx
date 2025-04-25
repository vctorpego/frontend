import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { Container, Title, Form, Input, Button, Label } from "./styles";

const EditCliente = () => {
  const { idCliente } = useParams();
  const [nomeCliente, setNomeCliente] = useState("");
  const [saldoCliente, setSaldoCliente] = useState("");
  const [limiteCliente, setLimiteCliente] = useState("");
  const [dtNascCliente, setDtNascCliente] = useState("");
  const [hasPermission, setHasPermission] = useState(false);
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
        alert("Você precisa estar logado!");
        navigate("/auth/login");
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp < Date.now() / 1000) {
          alert("Token expirado. Faça login novamente.");
          localStorage.removeItem("token");
          navigate("/auth/login");
          return;
        }

        const response = await axios.get(`http://localhost:8080/cliente/${idCliente}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const {
          nomeCliente,
          saldoCliente,
          limiteCliente,
          dtNascCliente,

        } = response.data;

        setNomeCliente(nomeCliente);
        setSaldoCliente(saldoCliente);
        setLimiteCliente(limiteCliente);
        setDtNascCliente(dtNascCliente);
      } catch (error) {
        console.error("Erro ao buscar o cliente:", error);
        alert("Erro ao carregar o cliente.");
      }
    };

    fetchCliente();
  }, [idCliente, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nomeCliente || !saldoCliente || !limiteCliente || !dtNascCliente) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Você precisa estar logado!");
      navigate("/auth/login");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp < Date.now() / 1000) {
        alert("Token expirado. Faça login novamente.");
        localStorage.removeItem("token");
        navigate("/auth/login");
        return;
      }

      await axios.put(
        `http://localhost:8080/cliente/alterar/${idCliente}`,
        {
          nomeCliente,
          saldoCliente: parseFloat(saldoCliente),
          limiteCliente: parseFloat(limiteCliente),
          dtNascCliente
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Cliente atualizado com sucesso!");
      navigate("/clientes");
    } catch (error) {
      console.error("Erro ao atualizar o cliente:", error);
      alert("Erro ao atualizar o cliente.");
    }
  };

  if (!hasPermission) return null;

  return (
    <Container>
      <Title>Editar Cliente</Title>
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
            disabled
            readOnly
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
        <Button type="submit">Atualizar Cliente</Button>
      </Form>
    </Container>
  );
};

export default EditCliente;
