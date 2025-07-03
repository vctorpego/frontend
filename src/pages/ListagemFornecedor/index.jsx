import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Grid from "../../components/Grid";
import ModalExcluir from "../../components/ModalExcluir";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/SearchBar";
import { Message } from "../ListagemProdutos/styles";
import Button from "../../components/Button";
import * as C from "./styles";

const Fornecedores = () => {
  const [fornecedores, setFornecedores] = useState([]);
  const [user, setUser] = useState(null);
  const [permissoes, setPermissoes] = useState([]);
  const [openModalExcluir, setOpenModalExcluir] = useState(false);
  const [idFornecedorExcluir, setIdFornecedorExcluir] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageType, setMessageType] = useState("");
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
    if (token) {
      return {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
    }
    return {};
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

          const telaAtual = "Tela de Fornecedores";
          const permissoesTela = permissionsResponse.data.find(
            (perm) => perm.tela === telaAtual
          );

          const permissoes = permissoesTela?.permissoes || [];
          setPermissoes(permissoes);
          console.log(`Permissões para ${telaAtual}:`, permissoes);

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

  const filterFornecedores = () => {
    if (!searchQuery) return fornecedores;
    return fornecedores.filter((fornecedor) =>
      fornecedor.nomeSocialFornecedor?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleDeleteFornecedor = (idFornecedor) => {
    setIdFornecedorExcluir(idFornecedor);
    setOpenModalExcluir(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = getToken();
      if (!token) return;

      await axios.delete(
        `http://localhost:8080/fornecedor/${idFornecedorExcluir}`,
        getRequestConfig()
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

  const handleCloseModal = () => {
    setOpenModalExcluir(false);
    setIdFornecedorExcluir(null);
  };

  const handleAddFornecedor = () => {
    navigate("/fornecedores/adicionar");
  };

  const columns = ["ID", "Nome Social", "Celular", "Email", "Chave Pix"];

  const handleEditFornecedor = (fornecedorId) => {
    navigate(`/fornecedores/editar/${fornecedorId}`);
  };

  const actions = [
    permissoes.includes("PUT") && "edit",
    permissoes.includes("DELETE") && "delete",
    permissoes.includes("POST") && "adicionar",
  ].filter(Boolean);

  const showActionsColumn = permissoes.includes("PUT") || permissoes.includes("DELETE");

  return (
    <C.Container>
      <C.Header>
        <C.Title>Lista de Fornecedores</C.Title>
        {permissoes.includes("POST") && (
          <C.AddButtonWrapper>
            <Button Text="Adicionar" onClick={handleAddFornecedor} />
          </C.AddButtonWrapper>
        )}
      </C.Header>

      {message && <Message type={messageType}>{message}</Message>}

      <SearchBar input={searchQuery} setInput={setSearchQuery} />

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
          actions={actions}
          showActionsColumn={showActionsColumn}
        />
      )}
      <ModalExcluir
        open={openModalExcluir}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
      />
    </C.Container>
  );
};

export default Fornecedores;
