import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Grid from "../../components/Grid";
import Sidebar from "../../components/Sidebar";
import SearchBar from "../../components/SearchBar";
import ModalExcluir from "../../components/ModalExcluir";
import { useNavigate } from "react-router-dom";
import * as C from "./styles";

const ListagemClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [user, setUser] = useState(null);
  const [openModalExcluir, setOpenModalExcluir] = useState(false);
  const [clienteExcluir, setClienteExcluir] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
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
    } catch (error) {
      console.error("Erro ao decodificar o token:", error);
      localStorage.removeItem("token");
      navigate("/auth/login");
      return null;
    }

    return token;
  };

  const getUserData = () => {
    const token = getToken();
    if (token) {
      const decoded = jwt_decode(token);
      setUser(decoded);
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
      setOpenModalExcluir(false);
      setClienteExcluir(null);
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
    }
  };

  const handleCloseModal = () => {
    setOpenModalExcluir(false);
    setClienteExcluir(null);
  };

  const handleAddCliente = () => {
    navigate("/clientes/adicionar");
  };

  const columns = [
    "Cliente",
    "ID",
    "Saldo",
    "Limite",
    "Limite Disponível",
    "Limite Usado",
    "Ultima Compra",
  ];

  const columnMap = {
    Cliente: "nomeCliente",
    ID: "idCliente",
    Saldo: "saldoCliente",
    Limite: "limiteCliente",
    "Limite Disponível": "faturaCliente",
    "Limite Usado": "limiteUsado",
    "Ultima Compra": "ultimaCompraCliente",
  };

  // Mapeia os clientes e adiciona o campo calculado limiteUsado
  const clientesComLimiteUsado = filterClientes().map((cliente) => ({
    ...cliente,
    limiteUsado:
      cliente.limiteCliente != null && cliente.faturaCliente != null
        ? (cliente.limiteCliente - cliente.faturaCliente).toFixed(2)
        : "N/A",
  }));

  const handleEditCliente = (clienteId) => {
    navigate(`/clientes/editar/${clienteId}`);
  };

  return (
    <C.Container>
      <Sidebar user={user} />
      <C.Content>
        <C.Title>Lista de Clientes</C.Title>
        <SearchBar input={searchQuery} setInput={setSearchQuery} />
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

        {clientes.length === 0 ? (
          <p>Nenhum cliente encontrado.</p>
        ) : (
          <Grid
            data={clientesComLimiteUsado}
            columns={columns}
            columnMap={columnMap}
            idKey="idCliente"
            handleDelete={handleDeleteCliente}
            handleEdit={handleEditCliente}
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
