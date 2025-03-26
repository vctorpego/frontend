import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode"; // Importando o jwt-decode para decodificar o token
import Grid from "../../components/Grid"; // Tabela com os clientes
import Sidebar from "../../components/Sidebar"; // Sidebar com menu
import ModalExcluir from "../../components/ModalExcluir"; // Modal de confirmação de exclusão
import { useNavigate } from "react-router-dom"; // Navegação
import * as C from "./styles"; // Importando os estilos
import SearchBar from "../../components/SearchBar";

const ListagemClientes = () => {
  const [clientes, setClientes] = useState([]); // Lista de clientes
  const [user, setUser] = useState(null); // Dados do usuário
  const [openModalExcluir, setOpenModalExcluir] = useState(false); // Estado para modal
  const [clienteExcluir, setClienteExcluir] = useState(null); // Cliente a ser excluído
  const [searchQuery, setSearchQuery] = useState(""); // Estado da busca
  const navigate = useNavigate();

  // Função para obter o token e verificar se é válido
  const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("Token não encontrado. Redirecionando para login...");
      navigate("/auth/login");
      return null;
    }

    // Verificar se o token está expirado
    try {
      const decoded = jwt_decode(token); // Decodifica o token
      const currentTime = Date.now() / 1000; // Tempo atual em segundos

      // Se o token estiver expirado
      if (decoded.exp < currentTime) {
        console.warn("Token expirado. Redirecionando para login...");
        localStorage.removeItem("token"); // Remove o token expirado
        navigate("/auth/login"); // Redireciona para o login
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

  // Configuração das requisições com o token
  const getRequestConfig = () => {
    const token = getToken();
    if (!token) return {}; // Retorna objeto vazio caso não tenha token
    return {
      headers: { Authorization: `Bearer ${token}` },
    };
  };

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    // Requisição para buscar os clientes
    axios
      .get("http://localhost:8080/cliente", getRequestConfig())
      .then(({ data }) => {
        console.log("Clientes carregados:", data); // Verificando os dados dos clientes
        setClientes(data);
      })
      .catch((err) => {
        console.error("Erro ao buscar clientes", err);
      });
  }, [navigate]);

  // Função de filtragem
  const filterClientes = () => {
    if (!searchQuery) return clientes; // Retorna todos os clientes se a pesquisa estiver vazia

    // Filtra pelos clientes que contêm o nome pesquisado
    return clientes.filter((cliente) => {
      return cliente.nomeCliente && cliente.nomeCliente.toLowerCase().includes(searchQuery.toLowerCase());
    });
  };

  const handleDeleteCliente = (clienteId) => {
    setClienteExcluir(clienteId);
    setOpenModalExcluir(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = getToken();
      if (!token) return;

      await axios.delete(
        `http://localhost:8080/cliente/${clienteExcluir}`,
        getRequestConfig()
      );
      setClientes((prevClientes) =>
        prevClientes.filter((cliente) => cliente.idCliente !== clienteExcluir)
      );
      setOpenModalExcluir(false);
      setClienteExcluir(null);
    } catch (error) {
      console.error("Erro ao excluir cliente", error);
    }
  };

  const handleCloseModal = () => {
    setOpenModalExcluir(false);
    setClienteExcluir(null);
  };

  // Função para redirecionar para a página de adicionar cliente
  const handleAddCliente = () => {
    navigate("/cliente/adicionar");
  };

  // Atualize a lista de colunas conforme necessário
  const columns = ["Nome", "ID", "Saldo", "Limite", "Data de Nascimento"];

  return (
    <C.Container>
      <Sidebar user={user} />
      <C.Content>
        <C.Title>Lista de Clientes</C.Title>

        {/* Barra de pesquisa */}
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

        {/* Verificar se a lista de clientes está vazia */}
        {clientes.length === 0 ? (
          <p>Nenhum cliente encontrado.</p>
        ) : (
          <Grid
            data={filterClientes()} // Filtra os clientes com base na pesquisa
            columns={columns}
            columnMap={{
              "Nome": "nomeCliente",
              "ID": "idCliente",
              "Saldo": "saldoCliente",
              "Limite": "limiteCliente",
              "Data de Nascimento": "dtNascCliente",
            }} // Certifique-se de mapear os atributos corretamente
            handleDelete={handleDeleteCliente}
            handleEdit={() => {}}
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
