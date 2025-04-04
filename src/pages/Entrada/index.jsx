import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { Container, Title, Form, Input, Button, Label, ErrorMessage } from "./styles";

const EntradaCliente = () => {
  const [idCliente, setIdCliente] = useState("");
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const resetarPagina = () => {
    setTimeout(() => {
      setIdCliente("");
      setCliente(null);
      setErro("");
    }, 3000); // ⏳ Aguarda 3 segundos antes de resetar
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

      // 🔍 Buscar dados do cliente
      const clienteResponse = await axios.get(`http://localhost:8080/cliente/${idCliente}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const clienteData = clienteResponse.data;
      const hoje = new Date();
      const ultimaCompra = clienteData.ultimaCompraCliente ? new Date(clienteData.ultimaCompraCliente) : null;

      // 🛑 Verificar última compra (não pode ser maior que 30 dias)
      if (ultimaCompra) {
        const diasDesdeUltimaCompra = Math.floor((hoje - ultimaCompra) / (1000 * 60 * 60 * 24));
        if (diasDesdeUltimaCompra > 30) {
          setErro("⚠️ Cliente possui Debitos a mais de 30 dias. Favor procurar a Gerência");
          return;
        }
      }



      // 🆕 Verificar se já tem uma comanda ativa
      try {
        const comandaExistente = await axios.get(`http://localhost:8080/comanda/ultima/${idCliente}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (comandaExistente.status === 200 && comandaExistente.data?.idCompraComanda) {
          setErro("⚠️ Cliente já possui uma comanda ativa.");
          return;
        }
      } catch (err) {
        // Se o status de erro for 404 (sem comanda ativa), cria a comanda
        if (err.response?.status === 404) {
          // ✅ Criar comanda, caso o cliente não tenha comanda ativa
          const comandaResponse = await axios.post(
            "http://localhost:8080/comanda",
            { cliente: { idCliente } },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          // 🎉 Exibir informações do cliente após entrada
          setCliente(comandaResponse.data.cliente);
          setErro(""); // Remove mensagens de erro anteriores
          resetarPagina();
          return;
        }

        setErro("❌ Erro ao processar. Tente novamente.");
        return;
      }

      // Caso haja outro erro, exibe uma mensagem genérica
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        if (status === 401) {
          setErro("❌ Cliente não encontrado.");
        } else if (status === 409) {
          setErro("⚠️ Cliente já está no salão.");
        } else {
          setErro("❌ Erro ao processar. Tente novamente.");
        }
      } else {
        setErro("❌ Erro na conexão com o servidor.");
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

      {erro && <ErrorMessage>{erro}</ErrorMessage>}

      {cliente && (
        <div>
          <h2>🎉 Seja bem-vindo, {cliente.nomeCliente}!</h2>
          <p>💰 Seu saldo é: R$ {cliente.saldoCliente?.toFixed(2) || "0.00"}</p>
        </div>
      )}
    </Container>
  );
};

export default EntradaCliente;
