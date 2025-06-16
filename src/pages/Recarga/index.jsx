import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import * as C from "./styles";
import { Message } from "../ListagemProdutos/styles";


const Recarga = () => {
  const [user, setUser] = useState(null);
  const [cartaoCliente, setCartaoCliente] = useState(""); // Usando o cartão do cliente
  const [cliente, setCliente] = useState(null);
  const [valor, setValor] = useState("");
  const [messageType, setMessageType] = useState(""); // tipo da mensagem: error, success, info
  const [message, setMessage] = useState("");


  const navigate = useNavigate();

  const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth/login");
      return null;
    }

    try {
      const decoded = jwt_decode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        localStorage.removeItem("token");
        navigate("/auth/login");
        return null;
      }

      return token;
    } catch (error) {
      console.error("Erro ao decodificar o token:", error);
      localStorage.removeItem("token");
      navigate("/auth/login");
      return null;
    }
  };

  const getRequestConfig = () => {
    const token = getToken();
    if (!token) return {};
    return {
      headers: { Authorization: `Bearer ${token}` },
    };
  };

  const buscarClientePorCartao = async () => {
    if (!cartaoCliente || cartaoCliente.length !== 10) return; // Verificar se o número do cartão está completo

    try {
      const res = await axios.get(
        `http://localhost:8080/cliente/cartao/${cartaoCliente}`,
        getRequestConfig()
      );
      setCliente(res.data);
    } catch (err) {
      console.error("Erro ao buscar cliente:", err);
      setMessageType("error");
      setMessage("Cliente não encontrado!");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
    }
  };

  const realizarRecarga = async () => {
    if (!cliente) {
      setMessageType("error");
      setMessage("Nenhum cliente selecionado!");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
      return;
    }

    const valorRecarga = parseFloat(valor);
    if (!valor || isNaN(valorRecarga) || valorRecarga <= 0) {
      setMessageType("error");
      setMessage("Digite um valor válido para recarga!");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
      return;
    }

    const creditoUsado = cliente.limiteCliente - cliente.faturaCliente;
    let restante = valorRecarga;

    try {
      // 1. Abater do crédito utilizado (fatura)
      if (creditoUsado > 0) {
        const valorParaFatura = Math.min(restante, creditoUsado);
        const novaFatura = cliente.faturaCliente + valorParaFatura;

        await axios.put(
          `http://localhost:8080/cliente/atualizar-fatura/${cliente.idCliente}`,
          { faturaCliente: novaFatura },
          getRequestConfig()
        );

        restante -= valorParaFatura;
      }

      // 2. Se sobrar, adicionar ao saldo
      if (restante > 0) {
        const novoSaldo = cliente.saldoCliente + restante;

        await axios.put(
          `http://localhost:8080/cliente/atualizar-saldo/${cliente.idCliente}`,
          { saldoCliente: novoSaldo },
          getRequestConfig()
        );
      }

      setMessageType("success");
      setMessage("Recarga realizada com sucesso!");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);;

      // Recarregar cliente atualizado
      await buscarClientePorCartao();
    } catch (error) {
      setMessageType("error");
      setMessage("Erro ao realizar recarga!");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);;
    }
  };

  // Função para capturar o número do cartão
  useEffect(() => {
    const handleCardInput = (event) => {
      const input = event.key;
      if (/^[0-9]$/.test(input)) {
        setCartaoCliente((prev) => {
          if (prev.length < 10) return prev + input;
          return prev;
        });
      }

      if (input === "Enter") {
        event.preventDefault();
      }
    };

    document.addEventListener("keydown", handleCardInput);
    return () => {
      document.removeEventListener("keydown", handleCardInput);
    };
  }, []);

  // Chama a busca do cliente automaticamente quando o cartão for lido
  useEffect(() => {
    if (cartaoCliente.length === 10) {
      console.log("Cartão completo, buscando cliente...");
      buscarClientePorCartao();
    }
  }, [cartaoCliente]);

  return (
    <C.Container>
      <Sidebar user={user} />
      <C.Content>
        <C.Title>Recarga</C.Title>
        {message && <Message type={messageType}>{message}</Message>}

        <C.Form>
          <label>Cartão do Cliente:</label>
          <div>{cartaoCliente}</div>

          {cliente && (
            <>
              <div>
                <p><strong>Cliente:</strong> {cliente.nomeCliente}</p>
                <p>Saldo Atual: R$ {cliente.saldoCliente.toFixed(2)}</p>
                <p>Limite Total: R$ {cliente.limiteCliente.toFixed(2)}</p>
                <p>Limite Disponível: R$ {cliente.faturaCliente.toFixed(2)}</p>
                <p>Crédito Utilizado: R$ {(cliente.limiteCliente - cliente.faturaCliente).toFixed(2)}</p>
              </div>

              <label>Valor da Recarga:</label>
              <input
                type="number"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="Digite o valor da recarga"
                min="1"
              />

              <button type="button" onClick={realizarRecarga}>
                Confirmar Recarga
              </button>
            </>
          )}
        </C.Form>
      </C.Content>
    </C.Container>
  );
};

export default Recarga;
