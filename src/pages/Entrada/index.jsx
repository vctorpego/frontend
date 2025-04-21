import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { Container, Title, Label, ErrorMessage } from "./styles";
import { debounce } from "lodash";

const EntradaCliente = () => {
  const [cartaoCliente, setCartaoCliente] = useState("");
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const resetarPagina = () => {
    setTimeout(() => {
      setCartaoCliente("");
      setCliente(null);
      setErro("");
    }, 4000); // 4 segundos
  };

  useEffect(() => {
    const handleCardInput = (event) => {
      const cardInput = event.key;
      if (/^[0-9a-zA-Z]$/.test(cardInput)) {
        setCartaoCliente((prev) => {
          if (prev.length < 12) return prev + cardInput;
          return prev;
        });
      }
      if (cardInput === "Enter") {
        event.preventDefault();
      }
    };

    document.addEventListener("keydown", handleCardInput);
    return () => {
      document.removeEventListener("keydown", handleCardInput);
    };
  }, []);

  useEffect(() => {
    if (cartaoCliente.length > 0) {
      const identificarCliente = debounce(async () => {
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
          const hoje = new Date();
          const ultimaCompra = clienteData.ultimaCompraCliente ? new Date(clienteData.ultimaCompraCliente) : null;

          if (ultimaCompra) {
            const diasDesdeUltimaCompra = Math.floor((hoje - ultimaCompra) / (1000 * 60 * 60 * 24));
            if (diasDesdeUltimaCompra > 30) {
              setErro("⚠️ Cliente com débitos acima de 30 dias. Favor procurar a gerência.");
              resetarPagina();
              return;
            }
          }

          try {
            const comandaExistente = await axios.get(
              `http://localhost:8080/comanda/ultima/${clienteData.idCliente}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (comandaExistente.status === 200 && comandaExistente.data?.idCompraComanda) {
              setErro("⚠️ Cliente já possui uma comanda ativa.");
              resetarPagina();
              return;
            }
          } catch (err) {
            if (err.response?.status === 404) {
              try {
                const comandaResponse = await axios.post(
                  "http://localhost:8080/comanda",
                  { cliente: { idCliente: clienteData.idCliente } },
                  { headers: { Authorization: `Bearer ${token}` } }
                );

                setCliente(comandaResponse.data.cliente);
                setErro("");
                resetarPagina();
                return;
              } catch {
                setErro("❌ Erro ao criar comanda.");
                resetarPagina();
                return;
              }
            } else {
              setErro("❌ Erro ao verificar comanda ativa.");
              resetarPagina();
              return;
            }
          }
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
          resetarPagina();
        } finally {
          setLoading(false);
        }
      }, 500);

      identificarCliente();
    }
  }, [cartaoCliente, navigate]);

  return (
    <Container>
      <Title>Entrada do Cliente</Title>
      <div>
        <Label>Cartão:</Label>
        <div>{cartaoCliente}</div>
      </div>

      {loading && <p>⏳ Processando...</p>}
      {erro && <ErrorMessage>{erro}</ErrorMessage>}

      {cliente && (
        <div>
          <h2> Seja bem-vindo, {cliente.nomeCliente}!</h2>
          <p> Saldo: R$ {cliente.saldoCliente?.toFixed(2) || "0.00"}</p>
        </div>
      )}
    </Container>
  );
};

export default EntradaCliente;
