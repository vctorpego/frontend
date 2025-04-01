import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Grid from "../../components/Grid";
import Sidebar from "../../components/Sidebar";
import ModalExcluir from "../../components/ModalExcluir";
import { useNavigate } from "react-router-dom";
import * as C from "./styles";
import SearchBar from "../../components/SearchBar";

const Fornecedores = () => {
  const [fornecedores, setFornecedores] = useState([]);
  const [user, setUser] = useState(null);
  const [openModalExcluir, setOpenModalExcluir] = useState(false);
  const [idFornecedorExcluir, setIdFornecedorExcluir] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

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

  // Carregar fornecedores após a primeira renderização
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    // Requisição para obter os fornecedores
    axios
      .get("http://localhost:8080/fornecedor", getRequestConfig()) // Passando a configuração com token
      .then(({ data }) => setFornecedores(data))
      .catch((err) => console.error("Erro ao buscar fornecedores", err));
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
    } catch (error) {
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
    console.log("Fornecedor a ser editado:", fornecedorId); // Verifique o ID

    navigate(`/fornecedores/editar/${fornecedorId}`);
  }

  return (
    <C.Container>
      <Sidebar user={user} />
      <C.Content>
        <C.Title>Lista de Fornecedores</C.Title>
        <SearchBar input={searchQuery} setInput={setSearchQuery} />
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
            idKey="idFornecedor"  // 🔹 Define o campo de ID correto
            handleDelete={handleDeleteFornecedor}
            handleEdit={handleEditFornecedor}
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
