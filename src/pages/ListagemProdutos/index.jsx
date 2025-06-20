import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Grid from "../../components/Grid";
import Sidebar from "../../components/Sidebar";
import ModalExcluir from "../../components/ModalExcluir";
import ModalPrinter from "../../components/ModalPrinter";
import { useNavigate } from "react-router-dom";
import * as C from "./styles";
import SearchBar from "../../components/SearchBar";
import { Message } from "../ListagemProdutos/styles";

const ListagemProdutos = () => {
  const [produtos, setProdutos] = useState([]);
  const [user, setUser] = useState(null);
  const [permissoes, setPermissoes] = useState([]);
  const [openModalExcluir, setOpenModalExcluir] = useState(false);
  const [produtoExcluir, setProdutoExcluir] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [openModalPrinter, setOpenModalPrinter] = useState(false);
  const [produtoPrinter, setProdutoPrinter] = useState(null);
  const [messageType, setMessageType] = useState(""); // tipo da mensagem: error, success, info
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

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
          const response = await axios.get(
            `http://localhost:8080/usuario/id/${userLogin.sub}`,
            getRequestConfig()
          );
          const userId = response.data;

          const permissionsResponse = await axios.get(
            `http://localhost:8080/permissao/telas/${userId}`,
            getRequestConfig()
          );

          const telaAtual = "Tela de Produtos";
          const permissoesTela = permissionsResponse.data.find(
            (perm) => perm.tela === telaAtual
          );

          const permissoes = permissoesTela?.permissoes || [];
          setPermissoes(permissoes);

          const produtosResponse = await axios.get(
            "http://localhost:8080/produto",
            getRequestConfig()
          );
          setProdutos(produtosResponse.data);
        } catch (error) {
          console.error("Erro ao buscar dados:", error);
        }
      }
    };

    fetchData();
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

      setProdutos((prev) =>
        prev.filter((produto) => produto.idProduto !== produtoExcluir)
      );
      setMessageType("success");
      setMessage("Produto excluido com sucesso!");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
      handleCloseModal();
    } catch (error) {
      console.error("Erro ao excluir produto", error);
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
    navigate(`/produtos/editar/${produtoId}`);
  };

  const handlePrintProduto = (produto) => {
    setProdutoPrinter(produto);
    setOpenModalPrinter(true);
  };

  const handleConfirmImpressao = async ({ quantidade }) => {
    if (!produtoPrinter) return;

    try {
      await axios.post(
        "http://localhost:3002/imprimir",
        {
          codigo: String(produtoPrinter?.codigoBarrasProduto),
          quantidade: quantidade,
        },
      );

      setMessageType("success");
      setMessage("Etiqueta enviada para impressão!");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);

      setOpenModalPrinter(false);
      setProdutoPrinter(null);

      console.log("Código:", produtoPrinter?.codigoBarrasProduto);
      console.log("Quantidade:", quantidade);
    } catch (error) {
      setMessageType("error");
      setMessage(" Erro ao enviar etiqueta enviada para impressão!");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);

      console.error(error);
    }
  };





  const handleClosePrinter = () => {
    setOpenModalPrinter(false);
    setProdutoPrinter(null);

  };

  const columns = [
    "ID",
    "Nome",
    "Código de Barras",
    "Estoque",
    "Preço",
    "Preço de Custo",
  ];

  const actions = [
    permissoes.includes("PUT") && "edit",
    permissoes.includes("DELETE") && "delete",
    "print",
  ].filter(Boolean);

  const showActionsColumn =
    permissoes.includes("PUT") ||
    permissoes.includes("DELETE") ||
    true;

  return (
    <C.Container>
      <Sidebar user={user} />
      <C.Content>
        <C.Title>Lista de Produtos</C.Title>
        {message && <Message type={messageType}>{message}</Message>}

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
              ID: "idProduto",
              Nome: "nomeProduto",
              "Código de Barras": "codigoBarrasProduto",
              Estoque: "quantProduto",
              Preço: "precoProduto",
              "Preço de Custo": "valorDeCustoProduto",
            }}
            idKey="idProduto"
            handleDelete={handleDeleteProduto}
            handleEdit={handleEditProduto}
            handlePrint={handlePrintProduto}
            actions={actions}
            showActionsColumn={showActionsColumn}
          />
        )}

        <ModalExcluir
          open={openModalExcluir}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
        />

        <ModalPrinter
          open={openModalPrinter}
          onClose={handleClosePrinter}
          onConfirm={handleConfirmImpressao}
          produto={produtoPrinter}
        />
      </C.Content>
    </C.Container>
  );
};

export default ListagemProdutos;
