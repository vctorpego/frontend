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
  const [ultimaCompraCliente, setUltimaCompraCliente] = useState("");
  const [faturaCliente, setFaturaCliente] = useState("");
  const navigate = useNavigate();

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
          ultimaCompraCliente,
          faturaCliente,
        } = response.data;

        setNomeCliente(nomeCliente);
        setSaldoCliente(saldoCliente);
        setLimiteCliente(limiteCliente);
        setDtNascCliente(dtNascCliente);
        setUltimaCompraCliente(ultimaCompraCliente);
        setFaturaCliente(faturaCliente);
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
          dtNascCliente,
          ultimaCompraCliente,
          faturaCliente: parseFloat(faturaCliente),
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
          <Label>Última Compra:</Label>
          <Input
            type="date"
            value={ultimaCompraCliente}
            onChange={(e) => setUltimaCompraCliente(e.target.value)}
          />
        </div>
        <div>
          <Label>Fatura:</Label>
          <Input
            type="number"
            value={faturaCliente}
            onChange={(e) => setFaturaCliente(e.target.value)}
            required
          />
        </div>
        <Button type="submit">Atualizar Cliente</Button>
      </Form>
    </Container>
  );
};

export default EditCliente;
