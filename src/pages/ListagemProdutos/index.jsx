import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Grid from "../../components/Grid";
import Sidebar from "../../components/Sidebar";
import ModalExcluir from "../../components/ModalExcluir";
import { useNavigate } from "react-router-dom";
import * as C from "./styles";
import SearchBar from "../../components/SearchBar";

const ListagemProdutos = () => {
  const [produtos, setProdutos] = useState([]);
  const [user, setUser] = useState(null);
  const [openModalExcluir, setOpenModalExcluir] = useState(false);
  const [produtoExcluir, setProdutoExcluir] = useState(null);
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
      if (decoded.exp < Date.now() / 1000) {
        localStorage.removeItem("token");
        navigate("/auth/login");
        return null;
      }
      setUser(decoded);
    } catch (error) {
      console.error("Erro ao decodificar o token:", error);
      localStorage.removeItem("token");
      navigate("/auth/login");
      return null;
    }

    return token;
  };

  // Função para adicionar o token diretamente nas requisições
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

    axios
      .get("http://localhost:8080/produto", getRequestConfig()) // Passando o token individualmente na requisição
      .then(({ data }) => {
        console.log("Produtos carregados:", data);
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
        getRequestConfig() // Passando o token na requisição de exclusão
      );

      // Remover produto da lista local após exclusão
      setProdutos((prevProdutos) =>
        prevProdutos.filter((produto) => produto.idProduto !== produtoExcluir)
      );
      setOpenModalExcluir(false);
      setProdutoExcluir(null);
    } catch (error) {

    }
  };

  const handleCloseModal = () => {
    setOpenModalExcluir(false);
    setProdutoExcluir(null);
  };

  const handleAddProduto = () => {
    navigate("/produtos/adicionar");
  };

  const handleEditProduto = (produtoId) => {
    console.log("Produto a ser editado:", produtoId); // Verifique o ID

    navigate(`/produtos/editar/${produtoId}`);

  };

  const columns = ["ID", "Nome", "Código de Barras", "Estoque", "Preço", "Preço de Custo"];

  return (
    <C.Container>
      <Sidebar user={user} />
      <C.Content>
        <C.Title>Lista de Produtos</C.Title>

        <SearchBar input={searchQuery} setInput={setSearchQuery} />

        <button
          onClick={handleAddProduto}
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
            columnMap={{
              "ID": "idProduto",
              "Nome": "nomeProduto",
              "Código de Barras": "codigoBarrasProduto",
              "Estoque": "quantProduto",
              "Preço": "precoProduto",
              "Preço de Custo": "valorDeCustoProduto",
            }}
            idKey="idProduto"  // 🔹 Define o campo de ID correto
            handleDelete={handleDeleteProduto}
            handleEdit={handleEditProduto}
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

export default ListagemProdutos;
