import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { Container, Title, Label, ErrorMessage } from "./styles";
import { debounce } from "lodash";

const SaidaCliente = () => {
  const [cartaoCliente, setCartaoCliente] = useState("");
  const [cliente, setCliente] = useState(null);
  const [comanda, setComanda] = useState(null);
  const [produtosDetalhados, setProdutosDetalhados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const resetarPagina = () => {
    setTimeout(() => {
      setCartaoCliente("");
      setCliente(null);
      setComanda(null);
      setProdutosDetalhados([]);
      setErro("");
    }, 3000);
  };

  useEffect(() => {
    let buffer = "";

    const handleKeyPress = (e) => {
      const key = e.key;

      if (/^[0-9a-zA-Z]$/.test(key)) {
        buffer += key;
      }

      if (key === "Enter") {
        if (buffer.length >= 8) {
          setCartaoCliente(buffer);
        }
        buffer = "";
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const enviarParaImpressao = async (cliente, comanda, produtos) => {
    try {
      await axios.post("http://localhost:3001/imprimir", {
        cliente,
        comanda,
        produtos,
      });
    } catch (error) {
      console.error("Erro ao imprimir:", error);
    }
  };

  const buscarDetalhesProdutos = async (comandaFinalizada) => {
    try {
      const token = localStorage.getItem("token");
      const promises = comandaFinalizada.comandaProdutos.map(async ({ idProduto, quantidade }) => {
        const res = await axios.get(`http://localhost:8080/produto/${idProduto}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Logando a resposta para verificar o valor
        console.log("Produto Detalhado:", res.data);  // Verifique os dados do produto aqui

        return {
          ...res.data,
          quantidade,
        };
      });

      const detalhes = await Promise.all(promises);
      setProdutosDetalhados(detalhes);
      await enviarParaImpressao(comandaFinalizada.cliente, comandaFinalizada, detalhes);
    } catch (error) {
      console.error("Erro ao buscar detalhes dos produtos:", error);
    }
  };

  useEffect(() => {
    if (!cartaoCliente) return;

    const processarSaida = async () => {
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
          setErro("⚠️ Sessão expirada. Faça login novamente.");
          localStorage.removeItem("token");
          navigate("/auth/login");
          return;
        }

        const clienteResponse = await axios.get(
          `http://localhost:8080/cliente/cartao/${cartaoCliente}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const clienteData = clienteResponse.data;

        const comandaResponse = await axios.get(
          `http://localhost:8080/comanda/ultima/${clienteData.idCliente}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (comandaResponse.status === 200) {
          const comandaOriginal = comandaResponse.data;

          const agora = new Date();
          const dataHoraSaida = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, "0")}-${String(agora.getDate()).padStart(2, "0")} ${String(agora.getHours()).padStart(2, "0")}:${String(agora.getMinutes()).padStart(2, "0")}`;

          await axios.put(
            `http://localhost:8080/comanda/saida/${comandaOriginal.idCompraComanda}`,
            { horaSaidaComanda: dataHoraSaida },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const comandaFinalizadaResponse = await axios.get(
            `http://localhost:8080/comanda/ultima-finalizada/${clienteData.idCliente}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const comandaFinalizada = comandaFinalizadaResponse.data;
          setCliente(comandaFinalizada.cliente);
          setComanda(comandaFinalizada);

          if (comandaFinalizada.comandaProdutos.length > 0) {
            await buscarDetalhesProdutos(comandaFinalizada);
          }

          resetarPagina();
        } else {
          setErro("⚠️ Não há comanda ativa para este cliente.");
        }
      } catch (error) {
        console.error("Erro ao processar saída:", error);
        setErro("❌ Erro ao registrar saída. Verifique o cartão.");
      } finally {
        setLoading(false);
      }
    };

    processarSaida();
  }, [cartaoCliente, navigate]);

  return (
    <Container>
      <Title>Saída do Cliente</Title>

      <Label>Cartão:</Label>
      <div>{cartaoCliente}</div>

      {loading && <p>🔄 Processando...</p>}
      {erro && <ErrorMessage>{erro}</ErrorMessage>}

      {cliente && (
        <div>
          <h2>Até logo, {cliente.nomeCliente}!</h2>
          <p>Saldo final: R$ {cliente.saldoCliente?.toFixed(2) || "0.00"}</p>
        </div>
      )}

      {comanda && (
        <div style={{ marginTop: "1rem", borderTop: "1px solid #ccc", paddingTop: "1rem" }}>
          <h3>Comanda Finalizada</h3>
          <p><strong>ID:</strong> {comanda.idCompraComanda}</p>
          <p><strong>Entrada:</strong> {comanda.horaEntradaComanda}</p>
          <p><strong>Saída:</strong> {comanda.horaSaidaComanda}</p>
          <p><strong>Total:</strong> R$ {comanda.valorTotalComanda?.toFixed(2)}</p>

          {produtosDetalhados.length > 0 && (
            <>
              <h4>Produtos:</h4>
              <ul>
                {produtosDetalhados.map((produto, index) => (
                  <li key={index}>
                    {produto.nomeProduto} x{produto.quantidade} – R$ {(produto.precoProduto * produto.quantidade).toFixed(2)}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </Container>
  );
};

export default SaidaCliente;
