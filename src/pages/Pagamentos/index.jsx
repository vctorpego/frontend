import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode"; // Importando o jwt-decode para decodificar o token
import Grid from "../../components/Grid"; // Tabela com as contas
import Sidebar from "../../components/Sidebar"; // Sidebar com menu
import ModalExcluir from "../../components/ModalExcluir"; // Modal de confirmação de exclusão
import { useNavigate } from "react-router-dom"; // Navegação
import * as C from "./styles"; // Importando os estilos
import SearchBar from "../../components/SearchBar";

const Pagamentos = () => {
  const [contas, setContas] = useState([]); // Lista de contas
  const [user, setUser] = useState(null); // Dados do usuário
  const [openModalExcluir, setOpenModalExcluir] = useState(false); // Estado para modal
  const [contaExcluir, setContaExcluir] = useState(null); // Conta a ser excluída
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

    // Requisição para buscar as contas
    axios
      .get("http://localhost:8080/controlecontas", getRequestConfig())
      .then(({ data }) => {
        console.log("Contas carregadas:", data); // Verificando os dados das contas
        setContas(data);
      })
      .catch((err) => {
        console.error("Erro ao buscar contas", err);
      });
  }, [navigate]);

  // Função de filtragem
  const filterContas = () => {
    if (!searchQuery) return contas; // Retorna todas as contas se a pesquisa estiver vazia

    // Caso tenha uma consulta, filtra pelas contas que contêm o nome pesquisado
    return contas.filter((conta) => {
      return conta.nomeConta && conta.nomeConta.toLowerCase().includes(searchQuery.toLowerCase());
    });
  };

  const handleDeleteConta = (contaId) => {
    setContaExcluir(contaId);
    setOpenModalExcluir(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = getToken();
      if (!token) return;

      await axios.delete(
        `http://localhost:8080/controlecontas/${contaExcluir}`,
        getRequestConfig()
      );
      setContas((prevContas) =>
        prevContas.filter((conta) => conta.idConta !== contaExcluir)
      );
      setOpenModalExcluir(false);
      setContaExcluir(null);
    } catch (error) {
      console.error("Erro ao excluir a conta:", error);
    }
  };

  const handleCloseModal = () => {
    setOpenModalExcluir(false);
    setContaExcluir(null);
  };

  // Função para redirecionar para a página de adicionar conta
  const handleAddConta = () => {
    navigate("/conta/adicionar"); // Substitua por sua rota para adicionar conta
  };

  // Atualize a lista de colunas conforme necessário
  const columns = ["ID", "Empresa", "Data de Compra", "Valor", "Vencimento", "Status"];

  return (
    <C.Container>
      <Sidebar user={user} />
      <C.Content>
        <C.Title>Lista de Contas</C.Title>

        {/* Barra de pesquisa */}
        <SearchBar input={searchQuery} setInput={setSearchQuery} />

        <button
          onClick={handleAddConta}
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
          Adicionar Conta
        </button>

        {/* Verificar se a lista de contas está vazia */}
        {contas.length === 0 ? (
          <p>Nenhuma conta encontrada.</p>
        ) : (
          <Grid
            data={filterContas()} // Filtra as contas com base na pesquisa
            columns={columns}
            columnMap={{
              "ID": "idContaControleContas",      
              "Data de Compra": "dtPagamentoControleConta",
              "Valor": "valorControleContas",
              "Vencimento": "dtVencimentoControleContas",
              "Status": "statusConta",
            }} // Certifique-se de mapear os atributos corretamente
            handleDelete={handleDeleteConta}
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

export default Pagamentos;
