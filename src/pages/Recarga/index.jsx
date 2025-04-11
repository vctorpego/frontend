import React, { useState } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import * as C from "./styles";

const Recarga = () => {
  const [user, setUser] = useState(null);
  const [clienteId, setClienteId] = useState("");
  const [cliente, setCliente] = useState(null);
  const [valor, setValor] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");

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

  const buscarCliente = async () => {
    if (!clienteId) return;

    try {
      const res = await axios.get(`http://localhost:8080/cliente/${clienteId}`, getRequestConfig());
      setCliente(res.data);
      // NÃO limpa a mensagem de sucesso aqui
    } catch (err) {
      console.error("Erro ao buscar cliente:", err);
      alert("Cliente não encontrado.");
      setCliente(null);
      setMensagemSucesso(""); // limpa apenas se der erro
    }
  };

  const realizarRecarga = async () => {
    if (!cliente) {
      alert("Nenhum cliente selecionado.");
      return;
    }

    const valorRecarga = parseFloat(valor);
    if (!valor || isNaN(valorRecarga) || valorRecarga <= 0) {
      alert("Digite um valor válido para recarga.");
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

      setMensagemSucesso("Recarga realizada com sucesso!");
      setValor("");

      // Mensagem some após 3 segundos
      setTimeout(() => setMensagemSucesso(""), 3000);

      // Recarregar cliente atualizado
      await buscarCliente();
    } catch (error) {
      console.error("Erro ao realizar recarga:", error);
      alert("Erro ao atualizar dados do cliente.");
    }
  };

  return (
    <C.Container>
      <Sidebar user={user} />
      <C.Content>
        <C.Title>Recarga</C.Title>

        {mensagemSucesso && <C.Sucesso>{mensagemSucesso}</C.Sucesso>}

        <C.Form>
          <label>ID do Cliente:</label>
          <input
            type="number"
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            placeholder="Digite o ID do cliente"
          />
          <button type="button" onClick={buscarCliente}>
            Buscar Cliente
          </button>

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
