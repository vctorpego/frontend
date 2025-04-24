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
  const [permissoes, setPermissoes] = useState([]); // Estado para armazenar as permissões
  const [openModalExcluir, setOpenModalExcluir] = useState(false);
  const [produtoExcluir, setProdutoExcluir] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Função para obter o token e as permissões
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

  // Função para configurar o cabeçalho da requisição com o token
  const getRequestConfig = () => {
    const token = getToken();
    if (!token) return {};
    return {
      headers: { Authorization: `Bearer ${token}` },
    };
  };

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

          // Buscar permissões para a tela de produtos
          const permissionsResponse = await axios.get(
            `http://localhost:8080/permissao/telas/${userId}`,
            getRequestConfig()
          );

          const telaAtual = "Tela de Produtos"; // Nome da tela que queremos verificar as permissões
          const permissoesTela = permissionsResponse.data.find(
            (perm) => perm.tela === telaAtual
          );

          const permissoes = permissoesTela?.permissoes || [];
          setPermissoes(permissoes);
          console.log(`Permissões para ${telaAtual}:`, permissoes);

          // Carregar produtos
          const produtosResponse = await axios.get(
            "http://localhost:8080/produto",
            getRequestConfig()
          );
          setProdutos(produtosResponse.data);
        } catch (error) {
          console.error("Erro ao buscar permissões ou produtos:", error);
        }
      }
    };

    fetchData();
  }, [navigate]);

  // Filtro de produtos baseado na pesquisa
  const filterProdutos = () => {
    if (!searchQuery) return produtos;
    return produtos.filter((produto) =>
      produto.nomeProduto.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Função para abrir modal de exclusão
  const handleDeleteProduto = (produtoId) => {
    setProdutoExcluir(produtoId);
    setOpenModalExcluir(true);
  };

  // Confirmar exclusão do produto
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

  // Fechar modal de exclusão
  const handleCloseModal = () => {
    setOpenModalExcluir(false);
    setProdutoExcluir(null);
  };

  // Navegar para a tela de adicionar produto
  const handleAddProduto = () => {
    navigate("/produtos/adicionar");
  };

  // Navegar para a tela de editar produto
  const handleEditProduto = (produtoId) => {
    console.log("Produto a ser editado:", produtoId);
    navigate(`/produtos/editar/${produtoId}`);
  };

  // Definindo colunas para a tabela
  const columns = ["ID", "Nome", "Código de Barras", "Estoque", "Preço", "Preço de Custo"];
  
  // Condicionar as ações disponíveis de acordo com as permissões
  const actions = [
    permissoes.includes("PUT") && "edit",
    permissoes.includes("DELETE") && "delete",
    permissoes.includes("POST") && "adicionar",
  ].filter(Boolean); // Filtra valores falsos (como `undefined`)

  return (
    <C.Container>
      <Sidebar user={user} />
      <C.Content>
        <C.Title>Lista de Produtos</C.Title>

        <SearchBar input={searchQuery} setInput={setSearchQuery} />

        {permissoes.includes("POST") && (
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
        )}

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
            idKey="idProduto"
            handleDelete={handleDeleteProduto}
            handleEdit={handleEditProduto}
            actions={actions} // Passando as ações permitidas
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
