import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { Container, Title, Form, Input, Button, Label, ErrorMessage } from "./styles";

const EntradaCliente = () => {
  const [idCliente, setIdCliente] = useState("");
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(""); // 🔹 Novo estado para mensagens de erro
  const navigate = useNavigate();

  const handleIdentificarCliente = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro(""); // 🔹 Resetando erro antes da requisição

    const token = localStorage.getItem("token");
    if (!token) {
      setErro("Você precisa estar logado!");
      navigate("/auth/login");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp < Date.now() / 1000) {
        setErro("Token expirado. Faça login novamente.");
        localStorage.removeItem("token");
        navigate("/auth/login");
        return;
      }

      // 🔹 1. Buscar informações do cliente
      const clienteResponse = await axios.get(
        `http://localhost:8080/cliente/${idCliente}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCliente(clienteResponse.data);

      // 🔹 2. Criar comanda se não houver uma ativa
      const comandaData = {
        cliente: clienteResponse.data,
        horaEntradaComanda: new Date().toISOString().slice(0, 19).replace("T", " "),
      };

      const comandaResponse = await axios.post(
        "http://localhost:8080/comanda",
        comandaData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Comanda criada com sucesso!");
      console.log("Comanda:", comandaResponse.data);
    } catch (error) {
      console.error("Erro ao identificar cliente:", error);

      if (error.response) {
        // 🔹 Verifica se o erro veio do backend
        const errorMessage = error.response.data.message || "Erro desconhecido.";

        if (error.response.status === 404) {
          setErro("⚠️ Cliente não encontrado. Verifique o ID e tente novamente.");
        } else if (error.response.status === 401) {
          setErro("🚫 Este cliente já está no salão.");
        } else {
          setErro(errorMessage);
        }
      } else {
        // 🔹 Erro de conexão ou falha inesperada
        setErro("❌ Erro ao conectar ao servidor. Tente novamente mais tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Entrada do Cliente</Title>
      <Form onSubmit={handleIdentificarCliente}>
        <div>
          <Label>ID do Cliente:</Label>
          <Input
            type="text"
            value={idCliente}
            onChange={(e) => setIdCliente(e.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "🔄 Processando..." : "Entrar"}
        </Button>
      </Form>

      {erro && <ErrorMessage>{erro}</ErrorMessage>} {/* 🔹 Exibição de erro na tela */}

      {cliente && !erro && (
        <div>
          <h2>🎉 Seja bem-vindo, {cliente.nomeCliente}!</h2>
          <p>💰 Seu saldo é: R$ {cliente.saldoCliente ? cliente.saldoCliente.toFixed(2) : "0.00"}</p>
        </div>
      )}
    </Container>
  );
};

export default EntradaCliente;
