import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Grid from "../../components/Grid";
import Sidebar from "../../components/Sidebar";
import SearchBar from "../../components/SearchBar";
import ModalExcluir from "../../components/ModalExcluir";
import { useNavigate } from "react-router-dom";
import * as C from "./styles";
import { Message } from "../ListagemProdutos/styles";


const ListagemClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [user, setUser] = useState(null);
  const [permissoes, setPermissoes] = useState([]);
  const [openModalExcluir, setOpenModalExcluir] = useState(false);
  const [clienteExcluir, setClienteExcluir] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [messageType, setMessageType] = useState(""); // tipo da mensagem: error, success, info
  const [message, setMessage] = useState("");


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
    } catch (error) {
      console.error("Erro ao decodificar o token:", error);
      localStorage.removeItem("token");
      navigate("/auth/login");
      return null;
    }

    return token;
  };

  const getUserData = async () => {
    const token = getToken();
    if (token) {
      const userLogin = jwt_decode(token);
      setUser(userLogin);

      try {
        const response = await axios.get(
          `http://localhost:8080/usuario/id/${userLogin.sub}`,
          getRequestConfig()
        );

        const userId = response.data;

        const permissionsResponse = await axios.get(
          `http://localhost:8080/permissao/telas/${userId}`,
          getRequestConfig()
        );

        const telaAtual = "Tela de Clientes";
        const permissoesTela = permissionsResponse.data.find(
          (perm) => perm.tela === telaAtual
        );

        const permissoes = permissoesTela?.permissoes || [];
        setPermissoes(permissoes);
        console.log(`Permissões para ${telaAtual}:`, permissoes);
      } catch (error) {
        console.error("Erro ao buscar permissões:", error);
      }
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const getRequestConfig = () => {
    const token = getToken();
    if (!token) return {};
    return {
      headers: { Authorization: `Bearer ${token}` },
    };
  };

  const fetchClientes = () => {
    const token = getToken();
    if (!token) return;

    axios
      .get("http://localhost:8080/cliente", getRequestConfig())
      .then(({ data }) => {
        setClientes(data);
      })
      .catch((err) => {
        console.error("Erro ao buscar clientes", err);
      });
  };

  useEffect(() => {
    fetchClientes();
  }, [navigate]);

  const filterClientes = () => {
    if (!searchQuery) return clientes;
    return clientes.filter((cliente) =>
      cliente.nomeCliente?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleDeleteCliente = (clienteId) => {
    setClienteExcluir(clienteId);
    setOpenModalExcluir(true);
  };

  const handleConfirmDelete = async () => {
    if (!clienteExcluir) return;

    try {
      await axios.delete(`http://localhost:8080/cliente/${clienteExcluir}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      fetchClientes();
      setMessageType("success");
      setMessage("Cliente deletado com sucesso!");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
      handleCloseModal();
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
      setOpenModalExcluir(false);
      setClienteExcluir(null);


      if (error.response && error.response.status === 409) {
        setMessageType("error");
        setMessage("Cliente está no salão, espere fechar a comanda antes de excluir!");
        setTimeout(() => {
          setMessage("");
          setMessageType("");
        }, 3000);
      } else {
        setMessageType("error");
        setMessage("Erro ao excluir cliente");
      }
    }
  };


  const handleCloseModal = () => {
    setOpenModalExcluir(false);
    setClienteExcluir(null);
  };

  const handleAddCliente = () => {
    navigate("/clientes/adicionar");
  };

  const handleEditCliente = (clienteId) => {
    navigate(`/clientes/editar/${clienteId}`);
  };

  const formatMoeda = (valor) => {
    if (valor == null) return "0,00";
    return Number(valor).toFixed(2).replace(".", ",");
  };

  const clientesComLimiteUsado = filterClientes().map((cliente) => ({
    ...cliente,
    saldoCliente: formatMoeda(cliente.saldoCliente),
    limiteCliente: formatMoeda(cliente.limiteCliente),
    faturaCliente: formatMoeda(cliente.faturaCliente),
    limiteUsado:
      cliente.limiteCliente != null && cliente.faturaCliente != null
        ? formatMoeda(cliente.limiteCliente - cliente.faturaCliente)
        : "N/A",
  }));

  // Lógica de permissões de ações (editar e excluir)
  const permissoesTelaAtual = permissoes || [];
  const actions = [];
  if (permissoesTelaAtual.includes("PUT")) actions.push("edit");
  if (permissoesTelaAtual.includes("DELETE")) actions.push("delete");
  if (permissoesTelaAtual.includes("POST")) actions.push("add");
  const showActionsColumn = permissoes.includes("PUT") || permissoes.includes("DELETE");


  return (
    <C.Container>
      <Sidebar user={user} />
      <C.Content>
        <C.Title>Lista de Clientes</C.Title>
        {message && <Message type={messageType}>{message}</Message>}
        <SearchBar input={searchQuery} setInput={setSearchQuery} />

        {actions.includes("add") && ( // Verifica se o usuário tem permissão de edição
          <button
            onClick={handleAddCliente}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Adicionar Cliente
          </button>
        )}

        {clientes.length === 0 ? (
          <p>Nenhum cliente encontrado.</p>
        ) : (
          <Grid
            data={clientesComLimiteUsado}
            columns={[
              "Cliente",
              "ID",
              "Saldo",
              "Limite",
              "Limite Disponível",
              "Limite Usado",
              "Ultima Compra",
            ]}
            columnMap={{
              Cliente: "nomeCliente",
              ID: "idCliente",
              Saldo: "saldoCliente",
              Limite: "limiteCliente",
              "Limite Disponível": "faturaCliente",
              "Limite Usado": "limiteUsado",
              "Ultima Compra": "ultimaCompraCliente",
            }}
            idKey="idCliente"
            handleDelete={(clienteId) => handleDeleteCliente(clienteId)} // Passando a função corretamente
            handleEdit={(clienteId) => handleEditCliente(clienteId)} // Passando a função corretamente
            actions={actions}
            showActionsColumn={showActionsColumn}
          />


        )}

        <ModalExcluir
          open={openModalExcluir}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
        />
      </C.Content>
    </C.Container>
  );
};

export default ListagemClientes;

