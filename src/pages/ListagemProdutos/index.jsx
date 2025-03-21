import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Grid from "../../components/Grid";
import Sidebar from "../../components/Sidebar";
import SearchBar from "../../components/SearchBar";
import ModalExcluir from "../../components/ModalExcluir"; // Modal de confirmação de exclusão
import ModalEditar from "../../components/ModalEditar"; // Modal de edição
import { useNavigate } from "react-router-dom";
import * as C from "./styles";

const ListagemProdutos = () => {
  const [produtos, setProdutos] = useState([]);
  const [user, setUser] = useState(null);
  const [openModalExcluir, setOpenModalExcluir] = useState(false);
  const [openModalEditar, setOpenModalEditar] = useState(false); // Estado para o modal de editar
  const [produtoExcluir, setProdutoExcluir] = useState(null);
  const [produtoEditar, setProdutoEditar] = useState(null); // Produto a ser editado
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("Token não encontrado. Redirecionando para login...");
      navigate("/auth/login");
      return null;
    }

    try {
      const decoded = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        console.warn("Token expirado. Redirecionando para login...");
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

  const getRequestConfig = () => {
    const token = getToken();
    if (!token) return {};
    return {
      headers: { Authorization: `Bearer ${token}` },
    };
  };

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    axios
      .get("http://localhost:8080/produto", getRequestConfig())
      .then(({ data }) => {
        setProdutos(data);
      })
      .catch((err) => {
        console.error("Erro ao buscar produtos", err);
      });
  }, [navigate]);

  const filterProdutos = () => {
    if (!searchQuery) return produtos;

    return produtos.filter((produto) =>
      produto.nomeProduto.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleDeleteProduto = (produtoId) => {
    setProdutoExcluir(produtoId);
    setOpenModalExcluir(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = getToken();
      if (!token) return;

      await axios.delete(
        `http://localhost:8080/produto/${produtoExcluir}`,
        getRequestConfig()
      );
      setProdutos((prevProdutos) =>
        prevProdutos.filter((produto) => produto.idProduto !== produtoExcluir)
      );
      setOpenModalExcluir(false);
      setProdutoExcluir(null);
    } catch (error) {
      console.error("Erro ao excluir produto", error);
    }
  };

  const handleCloseModal = () => {
    setOpenModalExcluir(false);
    setProdutoExcluir(null);
  };

  // Função para abrir o modal de edição
  const handleEditProduto = (produto) => {
    setProdutoEditar(produto); // Setar o produto a ser editado
    setOpenModalEditar(true); // Abrir o modal de edição
  };

  // Função que trata a atualização do produto
  const handleUpdateProduto = async (produtoAtualizado) => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await axios.put(
        `http://localhost:8080/produto/${produtoAtualizado.idProduto}`,
        produtoAtualizado,
        getRequestConfig()
      );

      // Atualiza o estado com o produto editado
      setProdutos((prevProdutos) =>
        prevProdutos.map((produto) =>
          produto.idProduto === produtoAtualizado.idProduto
            ? { ...produto, ...produtoAtualizado }
            : produto
        )
      );

      // Fecha o modal de edição após a atualização
      setOpenModalEditar(false);
      setProdutoEditar(null);
    } catch (error) {
      console.error("Erro ao atualizar produto", error);
    }
  };

  const handleCloseModalEditar = () => {
    setOpenModalEditar(false);
    setProdutoEditar(null);
  };

  const columns = ["Nome", "ID", "Preço de Custo", "Preço", "Estoque", "Código de Barras"];

  return (
    <C.Container>
      <Sidebar user={user} />
      <C.Content>
        <C.Title>Lista de Produtos</C.Title>
        
        <SearchBar input={searchQuery} setInput={setSearchQuery} />
        
        <button
          onClick={() => navigate("/produto/adicionar")}
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
          Adicionar Produto
        </button>
        
        {produtos.length === 0 ? (
          <p>Nenhum produto encontrado.</p>
        ) : (
          <Grid
            data={filterProdutos()}
            columns={columns}
            handleDelete={handleDeleteProduto}
            handleEdit={handleEditProduto} // Passando a função de editar
          />
        )}

        <ModalExcluir
          open={openModalExcluir}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
        />

        {/* Modal de Edição */}
        <ModalEditar
          open={openModalEditar}
          onClose={handleCloseModalEditar}
          produto={produtoEditar} // Passando o produto para o modal
          onSave={handleUpdateProduto} // Função para salvar as edições
        />
      </C.Content>
    </C.Container>
  );
};

export default ListagemProdutos;
