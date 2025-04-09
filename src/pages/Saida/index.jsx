import React, { useState } from "react";
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

  const buscarDetalhesProdutos = async (comanda) => {
    try {
      const token = localStorage.getItem("token");
      const promises = comanda.comandaProdutos.map(async ({ idProduto, quantidade }) => {
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

      // 1. Busca comanda ativa (sem hora de saída)
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

        setCliente(comandaFinalizada.cliente);
        setComanda(comandaFinalizada);

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

      {cliente && comanda && (
        <div style={{ marginTop: "20px" }}>
          <h3>Detalhes da Comanda</h3>
          <p><strong>ID Comanda:</strong> {comanda.idCompraComanda}</p>
          <p><strong>Entrada:</strong> {comanda.horaEntradaComanda}</p>
          <p><strong>Saída:</strong> {comanda.horaSaidaComanda}</p>
          <p><strong>Valor Total:</strong> R$ {comanda.valorTotalComanda.toFixed(2)}</p>
          <p><strong>Saldo antes da compra:</strong> R$ {comanda.saldoAntigo.toFixed(2)}</p>
          <p><strong>Limite antes da compra:</strong> R$ {comanda.limiteAntigo.toFixed(2)}</p>

          <h4>Produtos:</h4>
          <ul>
            {produtosDetalhados.map((produto, index) => (
              <li key={index}>
                {produto.nomeProduto} - qtd: {produto.quantidade} - R$ {produto.precoProduto.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Container>
  );
};

export default SaidaCliente;
