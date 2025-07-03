import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Grid from "../../components/GridPagamento";
import ModalExcluir from "../../components/ModalExcluir";
import { useNavigate } from "react-router-dom";
import * as C from "./styles";
import SearchBar from "../../components/SearchBar";
import { Message } from "../ListagemProdutos/styles";

const Pagamentos = () => {
  const [contas, setContas] = useState([]);
  const [user, setUser] = useState(null);
  const [permissoes, setPermissoes] = useState([]);
  const [openModalExcluir, setOpenModalExcluir] = useState(false);
  const [contaExcluir, setContaExcluir] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [messageType, setMessageType] = useState("");
  const [message, setMessage] = useState("");

  const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
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

  useEffect(() => {
    const loadData = async () => {
      const token = getToken();
      if (!token) return;

      try {
        const userLogin = jwt_decode(token);
        setUser(userLogin);

        const response = await axios.get(
          `http://localhost:8080/usuario/id/${userLogin.sub}`,
          getRequestConfig()
        );
        const userId = response.data;

        const permissionsResponse = await axios.get(
          `http://localhost:8080/permissao/telas/${userId}`,
          getRequestConfig()
        );

        const telaAtual = "Tela de Pagamentos";
        const permissoesTela = permissionsResponse.data.find(
          (perm) => perm.tela === telaAtual
        );
        const permissoes = permissoesTela?.permissoes || [];
        setPermissoes(permissoes);
        console.log(`Permissões para ${telaAtual}:`, permissoes);

        const contasResponse = await axios.get(
          "http://localhost:8080/controlecontas",
          getRequestConfig()
        );
        setContas(contasResponse.data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        navigate("/auth/login");
      }
    };

    loadData();
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
      await axios.delete(
        `http://localhost:8080/controlecontas/${contaExcluir}`,
        getRequestConfig()
      );
      const contasResponse = await axios.get(
        "http://localhost:8080/controlecontas",
        getRequestConfig()
      );
      setContas(contasResponse.data);
        setMessageType("success");
        setMessage("Conta apagada com sucesso!");
        setTimeout(() => {
          setMessage("");
          setMessageType("");
        }, 3000);
        handleCloseModal();

    } catch (error) {
      console.error("Erro ao excluir a conta:", error);
    }
  };

  const handleCloseModal = () => {
    setOpenModalExcluir(false);
    setContaExcluir(null);
  };

  const handlePagarConta = (contaId) => {
    navigate("/pagamentos/editar/" + contaId);
  };

  const handlePayConta = (contaId) => {
    navigate("/pagamentos/pagar/" + contaId);
  };

  const columns = [
    "ID",
    "Empresa",
    "Data de Pagamento",
    "Valor",
    "Vencimento",
    "Status",
  ];

  const actions = [
    permissoes.includes("PUT") && "edit",
    permissoes.includes("DELETE") && "delete",
    permissoes.includes("POST") && "adicionar",
  ].filter(Boolean);

  return (
    <C.Container>
      <C.Content>
        <C.Title>Lista de Contas</C.Title>
        {message && <Message type={messageType}>{message}</Message>}
        <SearchBar input={searchQuery} setInput={setSearchQuery} />

        {permissoes.includes("POST") && (
          <button
            onClick={() => navigate("/pagamentos/adicionar")}
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
        )}

        {contas.length === 0 ? (
          <p>Nenhuma conta encontrada.</p>
        ) : (
          <Grid
            data={filterContas()}
            columns={columns}
            columnMap={{
              ID: "idContaControleContas",
              Empresa: "fornecedor.nomeSocialFornecedor",
              "Data de Pagamento": "dtPagamentoControleContas",
              Valor: "valorControleContas",
              Vencimento: "dtVencimentoControleContas",
              Status: "statusControleContas",
            }}
            idKey="idContaControleContas"
            handleEdit={handlePagarConta}
            handleDelete={handleDeleteConta}
            handlePay={handlePayConta}
            actions={actions}
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
