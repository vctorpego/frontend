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
  const [fornecedorExcluir, setFornecedorExcluir] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
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
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    axios
      .get("http://localhost:8080/fornecedor", getRequestConfig())
      .then(({ data }) => setFornecedores(data))
      .catch((err) => console.error("Erro ao buscar fornecedores", err));
  }, [navigate]);

  const filterFornecedores = () => {
    if (!searchQuery) return fornecedores;
    return fornecedores.filter((fornecedor) =>
      fornecedor.nomeSocialFornecedor?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleDeleteFornecedor = (fornecedorId) => {
    setFornecedorExcluir(fornecedorId);
    setOpenModalExcluir(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = getToken();
      if (!token) return;

      await axios.delete(
        `http://localhost:8080/fornecedor/${fornecedorExcluir}`,
        getRequestConfig()
      );
      setFornecedores((prev) => prev.filter((f) => f.cnpjFornecedor !== fornecedorExcluir));
      setOpenModalExcluir(false);
      setFornecedorExcluir(null);
    } catch (error) {
      console.error("Erro ao excluir o fornecedor:", error);
    }
  };

  const handleCloseModal = () => {
    setOpenModalExcluir(false);
    setFornecedorExcluir(null);
  };

  const handleAddFornecedor = () => {
    navigate("/fornecedores/adicionar");
  };

  const columns = ["CNPJ", "Nome Social", "Celular", "Email", "Chave Pix"];

  return (
    <C.Container>
      <Sidebar user={user} />
      <C.Content>
        <C.Title>Lista de Fornecedores</C.Title>
        <SearchBar input={searchQuery} setInput={setSearchQuery} />
        <button onClick={handleAddFornecedor} style={{
          position: "absolute", top: "20px", right: "20px",
          padding: "10px 20px", backgroundColor: "#007bff",
          color: "white", border: "none", borderRadius: "5px",
          cursor: "pointer"
        }}>
          Adicionar Fornecedor
        </button>
        {fornecedores.length === 0 ? (
          <p>Nenhum fornecedor encontrado.</p>
        ) : (
          <Grid
            data={filterFornecedores()}
            columns={columns}
            columnMap={{
              "CNPJ": "cnpjFornecedor",
              "Nome Social": "nomeSocialFornecedor",
              "Celular": "celularFornecedor",
              "Email": "emailFornecedor",
              "Chave Pix": "chavePixFornecedor"
            }}
            handleDelete={handleDeleteFornecedor}
            handleEdit={() => {}}
          />
        )}
        <ModalExcluir open={openModalExcluir} onClose={handleCloseModal} onConfirm={handleConfirmDelete} />
      </C.Content>
    </C.Container>
  );
};

export default Fornecedores;
