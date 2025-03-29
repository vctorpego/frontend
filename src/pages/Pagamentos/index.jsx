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
  const [contas, setContas] = useState([]); // Lista de contas
  const [user, setUser] = useState(null); // Dados do usuário
  const [openModalExcluir, setOpenModalExcluir] = useState(false); // Modal de confirmação de exclusão
  const [contaExcluir, setContaExcluir] = useState(null); // Conta a ser excluída
  const [searchQuery, setSearchQuery] = useState(""); // Estado de busca
  const navigate = useNavigate();

  // Função para obter o token e verificar se é válido
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
      console.error("Erro ao decodificar o token:", error);
      localStorage.removeItem("token");
      navigate("/auth/login");
      return null;
    }

    return token;
  };

  // Função para obter configuração da requisição
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

  // Função de filtragem das contas
  const filterContas = () => {
    if (!searchQuery) return contas;
    return contas.filter((conta) =>
      conta.nomeConta?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Função para lidar com a exclusão de conta
  const handleDeleteConta = (contaId) => {
    setContaExcluir(contaId);
    setOpenModalExcluir(true);
  };

  // Confirmar a exclusão da conta
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

  // Fechar o modal de exclusão
  const handleCloseModal = () => {
    setOpenModalExcluir(false);
    setContaExcluir(null);
  };

  // Função para redirecionar para a página de pagar conta
  const handlePagarConta = (contaId) => {
    navigate('/pagamentos/editar/' + contaId); // Redireciona para a página de pagamento
  };

  // Colunas para a tabela de contas
  const columns = ["ID", "Empresa", "Data de Pagamento", "Valor", "Vencimento", "Status"];

  return (
    <C.Container>
      <Sidebar user={user} />
      <C.Content>
        <C.Title>Lista de Contas</C.Title>
        <SearchBar input={searchQuery} setInput={setSearchQuery} />
        <button
          onClick={() => navigate("/pagamentos/adicionar")} // Redireciona para a página de adicionar conta
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
            idKey="idContaControleContas"  // 🔹 Define o campo de ID correto
            handleDelete={handleDeleteConta}
            handleEdit={handlePagarConta} // Substituindo a função de edição pela de pagar conta
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
