import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { Container, Title, Label, ErrorMessage, CartaoCard, CartaoTexto, CartaoTextoLabel, CartaoCodigo, CartaoCodigoText, SaldoCard, SaldoText, SaldoValue, WelcomeCard } from "./styles";

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
    }, 4000);
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
    if (cartaoCliente.length === 0) return;

    const timeoutId = setTimeout(() => {
      const identificarCliente = async () => {
        setLoading(true);
        setErro("");

        const token = localStorage.getItem("token");
        if (!token) {
          setErro("Você precisa estar logado!");
          navigate("/auth/login");
          return;
        }

        try {
          const decodedToken = jwtDecode(token);
          if (decodedToken.exp < Date.now() / 1000) {
            setErro("Sessão expirada. Faça login novamente.");
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
          const ultimaCompra = clienteData.ultimaCompraCliente
            ? new Date(clienteData.ultimaCompraCliente)
            : null;
          const saldo = parseFloat(clienteData.saldoCliente) || 0;
          const limite = parseFloat(clienteData.limiteCliente) || 0;

          if (ultimaCompra) {
            const diasDesdeUltimaCompra = Math.floor((hoje - ultimaCompra) / (1000 * 60 * 60 * 24));
            if (diasDesdeUltimaCompra > 30) {
              setErro("Cliente com débitos acima de 30 dias. Favor procurar a gerência.");
              resetarPagina();
              return;
            }
          }

          if (saldo <= 0 && limite <= 0) {
            setErro("Cliente sem saldo ou limite disponível.Favor procurar a gerência.");
            resetarPagina();
            return;
          }

          try {
            const comandaExistente = await axios.get(
              `http://localhost:8080/comanda/ultima/${clienteData.idCliente}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (comandaExistente.status === 200 && comandaExistente.data?.idCompraComanda) {
              setErro("Cliente já possui uma comanda ativa.");
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
                setErro("Erro ao criar comanda.");
                resetarPagina();
                return;
              }
            } else {
              setErro("Erro ao verificar comanda ativa.");
              resetarPagina();
              return;
            }
          }
        } catch (error) {
          if (error.response) {
            const status = error.response.status;
            if (status === 401) {
              setErro("Cliente não encontrado.");
            } else if (status === 409) {
              setErro("Cliente já está no salão.");
            } else {
              setErro("Erro ao processar. Tente novamente.");
            }
          } else {
            setErro("Erro na conexão com o servidor.");
          }
          resetarPagina();
        } finally {
          setLoading(false);
        }
      };

      identificarCliente();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [cartaoCliente, navigate]);

  return (
    <Container>
      <Title>Entrada do Cliente</Title>

      <CartaoCard>
        <CartaoTexto>
          <CartaoTextoLabel>Cartão:</CartaoTextoLabel>
          <CartaoCodigo>
            <CartaoCodigoText>{cartaoCliente}</CartaoCodigoText>
          </CartaoCodigo>
        </CartaoTexto>
      </CartaoCard>

      {loading && <p>Processando...</p>}
      {erro && <ErrorMessage>{erro}</ErrorMessage>}

      {cliente && (
          <WelcomeCard>
            <h2>Seja bem-vindo, {cliente.nomeCliente}!</h2>
            <SaldoCard saldo={cliente.saldoCliente}>
            <SaldoText>Saldo :</SaldoText>
            <SaldoValue saldo={cliente.saldoCliente}>R$ {cliente.saldoCliente?.toFixed(2)|| "0.00"}</SaldoValue>
            <SaldoText>Limite :</SaldoText>
            <SaldoValue limite={cliente.limiteCliente}>R$ {cliente.limiteCliente?.toFixed(2)|| "0.00"}</SaldoValue>
          </SaldoCard>
          </WelcomeCard>
        )}

    </Container>
  );
};

export default EntradaCliente;
