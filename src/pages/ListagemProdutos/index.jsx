import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode"; // Importando o jwt-decode para decodificar o token
import Grid from "../../components/Grid"; // Tabela com os produtos
import Sidebar from "../../components/Sidebar"; // Sidebar com menu
import ModalExcluir from "../../components/ModalExcluir"; // Modal de confirmação de exclusão
import { useNavigate } from "react-router-dom"; // Navegação
import * as C from "./styles"; // Importando os estilos
import SearchBar from "../../components/SearchBar";

const ListagemProdutos = () => {
  const [produtos, setProdutos] = useState([]); // Lista de produtos
  const [user, setUser] = useState(null); // Dados do usuário
  const [openModalExcluir, setOpenModalExcluir] = useState(false); // Estado para modal
  const [produtoExcluir, setProdutoExcluir] = useState(null); // Produto a ser excluído
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


    // Requisição para buscar os produtos
    axios
      .get("http://localhost:8080/produto", getRequestConfig())
      .then(({ data }) => {
        console.log("Produtos carregados:", data); // Verificando os dados dos produtos
        setProdutos(data);
      })
      .catch((err) => {
        console.error("Erro ao buscar produtos", err);
      });
  }, [navigate]);

  // Função de filtragem
  const filterProdutos = () => {
    if (!searchQuery) return produtos; // Retorna todos os produtos se a pesquisa estiver vazia

    // Depuração: Veja como os produtos estão sendo filtrados

    
    // Caso tenha uma consulta, filtra pelos produtos que contém o nome pesquisado
    return produtos.filter((produto) => {

      // Agora verificamos o campo nomeProduto com o que foi digitado
      return produto.nomeProduto && produto.nomeProduto.toLowerCase().includes(searchQuery.toLowerCase());
    });
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

    }
  };

  const handleCloseModal = () => {
    setOpenModalExcluir(false);
    setProdutoExcluir(null);
  };

  // Função para redirecionar para a página de adicionar produto
  const handleAddProduto = () => {
    navigate("/produto/adicionar"); // Substitua por sua rota para adicionar produto
  };

  // Atualize a lista de colunas conforme necessário
  const columns = ["Nome", "ID", "Preço de Custo", "Preço", "Estoque", "Código de Barras"];

  const handleEditProduto = (produtoId) => {
    navigate('/produto/editar/' + produtoId);
  };


  return (
    <C.Container>
      <Sidebar user={user} />
      <C.Content>
        <C.Title>Lista de Produtos</C.Title>
        
        {/* Barra de pesquisa */}
        {/* <input
          type="text"
          placeholder="Digite um produto"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Atualiza o estado da pesquisa
          style={{
            padding: "10px",
            fontSize: "14px",
            marginBottom: "20px",
            width: "300px",
            borderRadius: "5px",
            border: "1px solid #ccc"
          }}
        /> */}

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
        
        {/* Verificar se a lista de produtos está vazia */}
        {produtos.length === 0 ? (
          <p>Nenhum produto encontrado.</p>
        ) : (
          <Grid
            data={filterProdutos()} // Filtra os produtos com base na pesquisa
            columns={columns}
            columnMap={{
              "Nome": "nomeProduto",         // Nome do Produto
              "ID": "idProduto",             // ID do Produto
              "Preço de Custo": "valorDeCustoProduto",  // Preço de Custo
              "Preço": "precoProduto",       // Preço
              "Estoque": "quantProduto",     // Quantidade (Estoque)
              "Código de Barras": "codigoBarrasProduto", // Código de Barras
            }} // Certifique-se de mapear os atributos corretamente
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