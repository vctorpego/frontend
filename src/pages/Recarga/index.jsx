import React, { useEffect, useState } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import * as C from "./styles";

const Recarga = () => {
  const [user, setUser] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [clienteId, setClienteId] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [valor, setValor] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (token) {
      setUser(jwt_decode(token));
      buscarClientes();
    }
  }, []);

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

  const buscarClientes = () => {
    axios
      .get("http://localhost:8080/cliente", getRequestConfig())
      .then((res) => setClientes(res.data))
      .catch((err) => console.error("Erro ao buscar clientes:", err));
  };

  const calcularNovoSaldoEFatura = (cliente, valorRecarga) => {
    let novoSaldo = cliente.saldoCliente;
    let novaFatura = cliente.faturaCliente;
    const valor = parseFloat(valorRecarga);

    if (cliente.saldoCliente === 0 && valor > 0) {
      if (valor >= novaFatura) {
        const sobra = valor - novaFatura;
        novaFatura = 0;
        novoSaldo = sobra;
      } else {
        novaFatura -= valor;
      }
    } else {
      novoSaldo += valor;
    }

    return { novoSaldo, novaFatura };
  };

  const realizarRecarga = () => {
    if (!clienteSelecionado) {
      alert("Selecione um cliente válido.");
      return;
    }

    if (!valor || isNaN(valor) || parseFloat(valor) <= 0) {
      alert("Digite um valor válido para recarga.");
      return;
    }

    const { novoSaldo, novaFatura } = calcularNovoSaldoEFatura(clienteSelecionado, valor);

    axios
      .put(
        `http://localhost:8080/cliente/atualizar-saldo/${clienteSelecionado.idCliente}`,
        { saldoCliente: novoSaldo, faturaCliente: novaFatura },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {
        const clientesAtualizados = clientes.map((c) =>
          c.idCliente === clienteSelecionado.idCliente
            ? { ...c, saldoCliente: novoSaldo, faturaCliente: novaFatura }
            : c
        );
        setClientes(clientesAtualizados);

        // Save recharge history
        axios
          .post(
            "http://localhost:8080/historico-recarga",
            {
              dataRecargaHistoricoRecarga: new Date().toISOString(),
              valorRecargaHistoricoRecarga: parseFloat(valor),
              cliente: { idCliente: clienteSelecionado.idCliente }, // Ensure proper mapping for cliente
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
          .then(() => {
            setValor("");
            setMensagemSucesso("Recarga realizada com sucesso!");
            setTimeout(() => {
              setMensagemSucesso("");
            }, 1000);
          })
          .catch((error) => {
            console.error("Erro ao salvar histórico de recarga:", error);
            alert("Ocorreu um erro ao salvar o histórico de recarga.");
          });
      })
      .catch((error) => {
        console.error("Erro ao realizar recarga:", error);
        alert("Ocorreu um erro ao realizar a recarga.");
      });
  };

  const handleClienteIdChange = (e) => {
    const id = e.target.value;
    setClienteId(id);
    const cliente = clientes.find((c) => c.idCliente === parseInt(id));
    setClienteSelecionado(cliente || null);
  };

  return (
    <C.Container>
      <Sidebar user={user} />

      <C.Content>
        <C.Title>Recarga</C.Title>

        {mensagemSucesso && <C.Sucesso>{mensagemSucesso}</C.Sucesso>}

        <C.Form>
          <label>Digite o ID do cliente:</label>
          <input
            type="number"
            placeholder="Digite o ID do cliente"
            value={clienteId}
            onChange={handleClienteIdChange}
          />

          {clienteSelecionado && (
            <div>
              <p>
                <strong>Cliente Selecionado:</strong> {clienteSelecionado.nomeCliente}
              </p>
            </div>
          )}

          <label>Valor da recarga:</label>
          <input
            type="number"
            placeholder="Digite o valor"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            min="1"
          />

          <button type="button" onClick={realizarRecarga}>
            Confirmar Recarga
          </button>
        </C.Form>
      </C.Content>
    </C.Container>
  );
};

export default Recarga;
