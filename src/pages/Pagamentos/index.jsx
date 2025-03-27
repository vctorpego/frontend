import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Grid from "../../components/Grid";
import Sidebar from "../../components/Sidebar";
import ModalExcluir from "../../components/ModalExcluir";
import { useNavigate } from "react-router-dom";
import * as C from "./styles";
import SearchBar from "../../components/SearchBar";

const Pagamentos = () => {
  const [contas, setContas] = useState([]);
  const [user, setUser] = useState(null);
  const [openModalExcluir, setOpenModalExcluir] = useState(false);
  const [contaExcluir, setContaExcluir] = useState(null);
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
    if (!token) return {};
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // Função para buscar contas
  const fetchContas = () => {
    const token = getToken();
    if (!token) return;

    axios
      .get("http://localhost:8080/controlecontas", getRequestConfig())
      .then(({ data }) => setContas(data))
      .catch((err) => console.error("Erro ao buscar contas", err));
  };

  useEffect(() => {
    fetchContas();
  }, []);

  const filterContas = () => {
    if (!searchQuery) return contas;
    return contas.filter((conta) =>
      conta.nomeConta?.toLowerCase().includes(searchQuery.toLowerCase())
    );
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

      // Recarregar a lista de contas após a exclusão
      fetchContas();

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

  const handleAddConta = () => {
    navigate("/pagamentos/adicionar");
  };

  const columns = ["ID", "Empresa", "Data de Pagamento", "Valor", "Vencimento", "Status"];

  return (
    <C.Container>
      <Sidebar user={user} />
      <C.Content>
        <C.Title>Lista de Contas</C.Title>
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

        {contas.length === 0 ? (
          <p>Nenhuma conta encontrada.</p>
        ) : (
          <Grid
            data={filterContas()}
            columns={columns}
            columnMap={{
              "ID": "idContaControleContas",
              "Empresa": "fornecedor.nomeSocialFornecedor",
              "Data de Pagamento": "dtPagamentoControleContas",
              "Valor": "valorControleContas",
              "Vencimento": "dtVencimentoControleContas",
              "Status": "statusControleContas",
            }}
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
