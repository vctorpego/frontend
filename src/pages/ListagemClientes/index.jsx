import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Grid from "../../components/Grid"; // Tabela com os clientes
import Sidebar from "../../components/Sidebar"; // Sidebar com menu
import SearchBar from "../../components/SearchBar"; // Barra de pesquisa
import ModalExcluir from "../../components/ModalExcluir"; // Modal de confirmação de exclusão
import { useNavigate } from "react-router-dom"; // Navegação
import * as C from "./styles"; // Importando os estilos

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

  // Função para obter dados do usuário (se necessário)
  const getUserData = () => {
    const token = getToken();
    if (token) {
      const decoded = jwt_decode(token);
      setUser(decoded); // Armazena os dados do usuário
    }
  };

  useEffect(() => {
    getUserData(); // Obtém os dados do usuário ao montar o componente
  }, []);

  // Configuração das requisições com o token
  const getRequestConfig = () => {
    const token = getToken();
    if (!token) return {}; // Retorna objeto vazio caso não tenha token
    return {
      headers: { Authorization: `Bearer ${token}` },
    };
  };

  // Função para buscar clientes
  const fetchClientes = () => {
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
  };

  useEffect(() => {
    fetchClientes(); // Carrega os clientes assim que a página for montada
  }, [navigate]);

  // Filtra os clientes com base na consulta de pesquisa
  const filterClientes = () => {
    if (!searchQuery) return clientes; // Retorna todos os clientes se a pesquisa estiver vazia

    return clientes.filter((cliente) => {
      return (
        cliente.nomeCliente &&
        cliente.nomeCliente.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  };

  // Função para excluir cliente
  const handleDeleteCliente = (clienteId) => {
    setClienteExcluir(clienteId);
    setOpenModalExcluir(true);
  };

  const handleConfirmDelete = async () => {
    console.log("Tentando excluir cliente com ID:", clienteExcluir);

    if (!clienteExcluir) {
      console.error("ID do cliente é inválido.");
      return;
    }

    try {
      // Requisição de exclusão do cliente
      const response = await axios.delete(`http://localhost:8080/cliente/${clienteExcluir}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Envia o token para autenticação
        },
      });
      console.log("Cliente excluído:", response.data);

      // Atualiza a lista de clientes após a exclusão
      fetchClientes(); // Chama a função para buscar os clientes atualizados

      // Fecha o modal e limpa o cliente a ser excluído
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
    "Valor Gasto", 
    "Ultima Compra"
  ]; // Colunas da tabela

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
            data={filterClientes()}
            columns={columns}
            columnMap={{
              Cliente: "nomeCliente",
              ID: "idCliente", 
              "Data de Nascimento": "dtNascCliente", 
              "Ultima Compra": "ultimaCompraCliente",
              Saldo: "saldoCliente",
              Limite: "limiteCliente",
            }}
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
