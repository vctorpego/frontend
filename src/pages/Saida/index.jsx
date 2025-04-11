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
  ErrorMessage,
} from "./styles";

const SaidaCliente = () => {
  const [idCliente, setIdCliente] = useState("");
  const [cliente, setCliente] = useState(null);
  const [comanda, setComanda] = useState(null);
  const [produtosDetalhados, setProdutosDetalhados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  // Envia para o servidor de impressão
  const enviarParaImpressao = async (cliente, comanda, produtos) => {
    try {
      await axios.post("http://localhost:3001/imprimir", {
        cliente,
        comanda,
        produtos,
      });
    } catch (err) {
      console.error("Erro ao enviar para servidor de impressão:", err);
    }
  };

  const buscarDetalhesProdutos = async (comandaFinalizada) => {
    try {
      const token = localStorage.getItem("token");
      const promises = comandaFinalizada.comandaProdutos.map(async ({ idProduto, quantidade }) => {
        const res = await axios.get(`http://localhost:8080/produto/${idProduto}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return {
          ...res.data,
          quantidade,
        };
      });

      const detalhes = await Promise.all(promises);
      setProdutosDetalhados(detalhes);

      // Depois que tudo está carregado, envia para impressão
      enviarParaImpressao(comandaFinalizada.cliente, comandaFinalizada, detalhes);
    } catch (error) {
      console.error("Erro ao buscar detalhes dos produtos:", error);
    }
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

      // 1. Busca comanda ativa
      const comandaResponse = await axios.get(
        `http://localhost:8080/comanda/ultima/${idCliente}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (comandaResponse.status === 200) {
        const comandaOriginal = comandaResponse.data;

        // 2. Gera data/hora atual
        const agora = new Date();
        const dataHoraSaida = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, "0")}-${String(agora.getDate()).padStart(2, "0")} ${String(agora.getHours()).padStart(2, "0")}:${String(agora.getMinutes()).padStart(2, "0")}`;

        // 3. PUT para registrar hora de saída
        await axios.put(
          `http://localhost:8080/comanda/saida/${comandaOriginal.idCompraComanda}`,
          { horaSaidaComanda: dataHoraSaida },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // 4. Busca comanda já finalizada
        const comandaFinalizadaResponse = await axios.get(
          `http://localhost:8080/comanda/ultima-finalizada/${idCliente}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const comandaFinalizada = comandaFinalizadaResponse.data;

        // 5. Atualiza estados para exibição
        setCliente(comandaFinalizada.cliente);
        setComanda(comandaFinalizada);

        // 6. Busca produtos e imprime depois disso
        if (comandaFinalizada.comandaProdutos.length > 0) {
          await buscarDetalhesProdutos(comandaFinalizada);
        }

      } else {
        setErro("⚠️ Não há comanda ativa para este cliente.");
      }
    } catch (error) {
      console.error(error);
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
            value={idCliente}
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
