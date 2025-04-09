import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { useReactToPrint } from "react-to-print";

import {
  Container,
  Title,
  Form,
  Input,
  Button,
  Label,
  ErrorMessage,
} from "./styles";

import ComandaPrint from "../../components/ComandaPrint"; // ajuste o caminho conforme sua estrutura

const SaidaCliente = () => {
  const [idCliente, setIdCliente] = useState("");
  const [cliente, setCliente] = useState(null);
  const [comanda, setComanda] = useState(null);
  const [produtosDetalhados, setProdutosDetalhados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => {
      console.log("📌 Ref recebido em useReactToPrint →", printRef.current);
      if (!printRef.current) {
        console.error("❌ Nada a imprimir! O ref está null.");
      }
      return printRef.current;
    },
    onBeforeGetContent: () => {
      console.log("📄 Preparando conteúdo para impressão...");
    },
    onAfterPrint: () => {
      console.log("✅ Impressão concluída.");
    },
    onPrintError: (error) => {
      console.error("🚨 Erro ao imprimir:", error);
    },
  });

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

      const comandaResponse = await axios.get(`http://localhost:8080/comanda/ultima/${idCliente}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (comandaResponse.status === 200) {
        const comandaOriginal = comandaResponse.data;

        const agora = new Date();
        const dataHoraSaida = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, "0")}-${String(agora.getDate()).padStart(2, "0")} ${String(agora.getHours()).padStart(2, "0")}:${String(agora.getMinutes()).padStart(2, "0")}`;

        await axios.put(
          `http://localhost:8080/comanda/saida/${comandaOriginal.idCompraComanda}`,
          { horaSaidaComanda: dataHoraSaida },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const finalizadaResponse = await axios.get(
          `http://localhost:8080/comanda/ultima-finalizada/${idCliente}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const comandaFinalizada = finalizadaResponse.data;
        setCliente(comandaFinalizada.cliente);
        setComanda(comandaFinalizada);

        if (comandaFinalizada.comandaProdutos.length > 0) {
          await buscarDetalhesProdutos(comandaFinalizada);
        }

        // Aciona impressão automaticamente (opcional)
        setTimeout(() => {
          console.log("🖨️ Chamando handlePrint após registro de saída...");
          handlePrint();
        }, 500);
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

      {/* Componente invisível para impressão */}
      {comanda && (
        <>
          <div style={{ position: "absolute", top: "-9999px", visibility: "hidden" }}>
            <ComandaPrint comanda={comanda} ref={(el) => {
              printRef.current = el;
              console.log("🔎 Elemento real referenciado para impressão:", el);
            }} />
          </div>
          <div style={{ marginTop: "20px" }}>
            <h3>🧾 Prévia Visual:</h3>
            <ComandaPrint comanda={comanda} />
            <Button onClick={handlePrint} style={{ marginTop: "10px" }}>
              🖨️ Imprimir Comanda
            </Button>
          </div>
        </>
      )}
    </Container>
  );
};

export default SaidaCliente;
