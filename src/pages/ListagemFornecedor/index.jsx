import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Grid from "../../components/Grid";
import Sidebar from "../../components/Sidebar";
import ModalExcluir from "../../components/ModalExcluir";
import { useNavigate } from "react-router-dom";
import * as C from "./styles";
import SearchBar from "../../components/SearchBar";
import { Message } from "../ListagemProdutos/styles";

const Fornecedores = () => {
  const [fornecedores, setFornecedores] = useState([]);
  const [user, setUser] = useState(null);
  const [permissoes, setPermissoes] = useState([]);
  const [openModalExcluir, setOpenModalExcluir] = useState(false);
  const [idFornecedorExcluir, setIdFornecedorExcluir] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [messageType, setMessageType] = useState(""); // tipo da mensagem: error, success, info
  const [message, setMessage] = useState("");

  // Função para obter o token e validar a expiração
  const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth/login");
      return null;
    }
    try {
      const decoded = jwt_decode(token);
      if (decoded.exp < Date.now() / 1000) {
        localStorage.removeItem("token");
        navigate("/auth/login");
        return null;
      }
      setUser(decoded);
    } catch (error) {
      localStorage.removeItem("token");
      navigate("/auth/login");
      return null;
    }
    return token;
  };

  // Função para retornar a configuração com o token no cabeçalho
  const getRequestConfig = () => {
    const token = getToken();
    if (token) {
      return {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
    }
    return {}; // Se não tiver token, retorna um objeto vazio
  };

  // Função para carregar dados do fornecedor e permissões
  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      if (token) {
        const userLogin = jwt_decode(token);
        setUser(userLogin);

        try {
          // Buscar usuário no backend para pegar ID
          const response = await axios.get(
            `http://localhost:8080/usuario/id/${userLogin.sub}`,
            getRequestConfig()
          );

          const userId = response.data;

          // Buscar permissões para a tela de fornecedores
          const permissionsResponse = await axios.get(
            `http://localhost:8080/permissao/telas/${userId}`,
            getRequestConfig()
          );

          const telaAtual = "Tela de Fornecedores"; // Nome da tela que queremos verificar as permissões
          const permissoesTela = permissionsResponse.data.find(
            (perm) => perm.tela === telaAtual
          );

          const permissoes = permissoesTela?.permissoes || [];
          setPermissoes(permissoes);
          console.log(`Permissões para ${telaAtual}:`, permissoes);

          // Carregar fornecedores
          const fornecedoresResponse = await axios.get(
            "http://localhost:8080/fornecedor",
            getRequestConfig()
          );
          setFornecedores(fornecedoresResponse.data);
        } catch (error) {
          console.error("Erro ao buscar permissões ou fornecedores:", error);
        }
      }
    };

    fetchData();
  }, [navigate]);

  // Função para filtrar fornecedores com base na busca
  const filterFornecedores = () => {
    if (!searchQuery) return fornecedores;
    return fornecedores.filter((fornecedor) =>
      fornecedor.nomeSocialFornecedor?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Função para abrir o modal de exclusão
  const handleDeleteFornecedor = (idFornecedor) => {
    setIdFornecedorExcluir(idFornecedor);
    setOpenModalExcluir(true);
  };

  // Função para confirmar a exclusão de um fornecedor
  const handleConfirmDelete = async () => {
    try {
      const token = getToken();
      if (!token) return;

      // Requisição para excluir fornecedor
      await axios.delete(
        `http://localhost:8080/fornecedor/${idFornecedorExcluir}`,
        getRequestConfig() // Passando a configuração com token
      );
      setFornecedores((prev) => prev.filter((f) => f.idFornecedor !== idFornecedorExcluir));
      setOpenModalExcluir(false);
      setIdFornecedorExcluir(null);
      setMessageType("success");
      setMessage("Fornecedor excluido com sucesso");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
      handleCloseModal();

    } catch (error) {
      if (error.response.status == 401) {
        setMessageType("error");
        setMessage("Apague as contas do fornecedor antes de Deleta-lo!");
        setTimeout(() => {
          setMessage("");
          setMessageType("");
        }, 3000);
        handleCloseModal();

      }
      console.error("Erro ao excluir o fornecedor:", error);
    }
  };

  // Fechar o modal de exclusão
  const handleCloseModal = () => {
    setOpenModalExcluir(false);
    setIdFornecedorExcluir(null);
  };

  // Navegar para a tela de adicionar fornecedor
  const handleAddFornecedor = () => {
    navigate("/fornecedores/adicionar");
  };

  // Definir as colunas para exibição na tabela
  const columns = ["ID", "Nome Social", "Celular", "Email", "Chave Pix"];

  const handleEditFornecedor = (fornecedorId) => {
    navigate(`/fornecedores/editar/${fornecedorId}`);
  };

  // Definir as ações com base nas permissões
  const actions = [
    permissoes.includes("PUT") && "edit",
    permissoes.includes("DELETE") && "delete",
    permissoes.includes("POST") && "adicionar",
  ].filter(Boolean); // Filtra valores falsos (como `undefined`)

  // Definir se deve mostrar a coluna de ações
  const showActionsColumn = permissoes.includes("PUT") || permissoes.includes("DELETE");

  return (
    <C.Container>
      <Sidebar user={user} />
      <C.Content>
        <C.Title>Lista de Fornecedores</C.Title>
        {message && <Message type={messageType}>{message}</Message>}
        <SearchBar input={searchQuery} setInput={setSearchQuery} />

        {permissoes.includes("POST") && (
          <button
            onClick={handleAddFornecedor}
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
            Adicionar Fornecedor
          </button>
        )}

        {fornecedores.length === 0 ? (
          <p>Nenhum fornecedor encontrado.</p>
        ) : (
          <Grid
            data={filterFornecedores()}
            columns={columns}
            columnMap={{
              ID: "idFornecedor",
              "Nome Social": "nomeSocialFornecedor",
              "Celular": "celularFornecedor",
              "Email": "emailFornecedor",
              "Chave Pix": "chavePixFornecedor",
            }}
            idKey="idFornecedor"
            handleDelete={handleDeleteFornecedor}
            handleEdit={handleEditFornecedor}
            actions={actions} // Passando as ações permitidas
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

export default Fornecedores;
