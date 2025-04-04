import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { Container, Title, Form, Input, Button, Label, ErrorMessage } from "./styles";

const SaidaCliente = () => {
  const [idCliente, setIdCliente] = useState(""); // Continuamos usando o idCliente
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const resetarPagina = () => {
    setTimeout(() => {
      setIdCliente(""); // Resetando idCliente
      setCliente(null);
      setErro("");
    }, 3000);
  };

  const handleIdentificarCliente = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro("");

    const token = localStorage.getItem("token");
    if (!token) {
      setErro("❌ Você precisa estar logado!");
      navigate("/auth/login");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp < Date.now() / 1000) {
        setErro("⚠️ Token expirado. Faça login novamente.");
        localStorage.removeItem("token");
        navigate("/auth/login");
        return;
      }

      // 🔍 Buscar a comanda ativa do cliente pelo idCliente
      const comandaResponse = await axios.get(`http://localhost:8080/comanda/ultima/${idCliente}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Verifica se a comanda ativa foi encontrada
      if (comandaResponse.status === 200) {
        setCliente(comandaResponse.data.cliente); // Exibe dados do cliente da comanda

        // 🔥 Registrar a saída, caso a comanda ativa tenha sido encontrada
        const dataHoraSaida = new Date().toISOString().slice(0, 16).replace("T", " "); // Formato de data
        await axios.put(`http://localhost:8080/comanda/saida/${comandaResponse.data.idCompraComanda}`, {
          horaSaidaComanda: dataHoraSaida, // Enviando hora de saída
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setErro(""); // Limpa mensagens de erro
        resetarPagina();
      } else {
        setErro("⚠️ Não há comanda ativa para este cliente.");
      }
    } catch (error) {
      setErro("❌ Erro ao registrar saída. Verifique o ID do cliente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Saída do Cliente</Title>
      <Form onSubmit={handleIdentificarCliente}>
        <div>
          <Label>ID do Cliente:</Label>
          <Input
            type="text"
            value={idCliente} // Usando idCliente para buscar a comanda ativa
            onChange={(e) => setIdCliente(e.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "🔄 Processando..." : "Registrar Saída"}
        </Button>
      </Form>

      {erro && <ErrorMessage>{erro}</ErrorMessage>}

      {cliente && (
        <div>
          <h2>👋 Até logo, {cliente.nomeCliente}!</h2>
          <p>💰 Seu saldo final é: R$ {cliente.saldoCliente?.toFixed(2) || "0.00"}</p>
        </div>
      )}
    </Container>
  );
};

export default SaidaCliente;
