import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Grid from "../../components/Grid";
import Sidebar from "../../components/Sidebar";
import ModalExcluir from "../../components/ModalExcluir";
import { useNavigate } from "react-router-dom";
import * as C from "./styles";
import SearchBar from "../../components/SearchBar";

const ListagemUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [user, setUser] = useState(null);
  const [openModalExcluir, setOpenModalExcluir] = useState(false);
  const [usuarioExcluir, setUsuarioExcluir] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userPermissions, setUserPermissions] = useState([]);
  const [permissoesTelaAtual, setPermissoesTelaAtual] = useState([]);
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
      return token;
    } catch (error) {
      console.error("Erro ao decodificar token:", error);
      localStorage.removeItem("token");
      navigate("/auth/login");
      return null;
    }
  };

  const getRequestConfig = () => {
    const token = localStorage.getItem("token");
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const decoded = jwt_decode(token);
    const userLogin = decoded.sub;

    // Buscar usuários
    axios
      .get("http://localhost:8080/usuario", getRequestConfig())
      .then(({ data }) => {
        setUsuarios(data);
      })
      .catch((err) => {
        console.error("Erro ao buscar usuários:", err);
      });

    // Buscar permissões do usuário logado
    const fetchUserPermissions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/usuario/id/${userLogin}`,
          getRequestConfig()
        );
        const userId = response.data;

        const permissionsResponse = await axios.get(
          `http://localhost:8080/permissao/telas/${userId}`,
          getRequestConfig()
        );
        setUserPermissions(permissionsResponse.data);

        const telaAtual = "Tela de Usuarios";
        const permissoesTela = permissionsResponse.data.find(
          (perm) => perm.tela === telaAtual
        );

        const permissoes = permissoesTela?.permissoes || [];
        setPermissoesTelaAtual(permissoes);
        console.log(`Permissões para ${telaAtual}:`, permissoes);
      } catch (error) {
        console.error("Erro ao buscar permissões:", error);
      }
    };

    fetchUserPermissions();
  }, [navigate]);

  const filterUsuarios = () => {
    return !searchQuery
      ? usuarios
      : usuarios.filter((usuario) =>
          usuario.nomeUsuario.toLowerCase().includes(searchQuery.toLowerCase())
        );
  };

  const handleDeleteUsuario = (usuarioId) => {
    setUsuarioExcluir(usuarioId);
    setOpenModalExcluir(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/usuario/${usuarioExcluir}`,
        getRequestConfig()
      );

      setUsuarios((prev) =>
        prev.filter((usuario) => usuario.idUsuario !== usuarioExcluir)
      );
      setOpenModalExcluir(false);
      setUsuarioExcluir(null);
    } catch (error) {
      if (error.response?.status === 409) {
        alert("⚠️ Você não pode excluir o próprio usuário.");
      } else{
        console.error("Erro ao deletar usuário:", error);
        alert("❌ Ocorreu um erro ao deletar o usuário.");
      }
    }
  };

  const handleCloseModal = () => {
    setOpenModalExcluir(false);
    setUsuarioExcluir(null);
  };

  const handleAddUsuario = () => {
    navigate("/usuarios/adicionar");
  };

  const handleEditUsuario = (usuarioId) => {
    navigate(`/usuarios/editar/${usuarioId}`);
  };

  const columns = ["ID", "Nome", "Email", "Telefone", "Login"];

  const actions = [];
  if (permissoesTelaAtual.includes("PUT")) actions.push("edit");
  if (permissoesTelaAtual.includes("DELETE")) actions.push("delete");

  const showActionsColumn =
    permissoesTelaAtual.includes("PUT") || permissoesTelaAtual.includes("DELETE");

  return (
    <C.Container>
      <Sidebar user={user} />
      <C.Content>
        <C.Title>Lista de Usuários</C.Title>

        <SearchBar input={searchQuery} setInput={setSearchQuery} />

        {permissoesTelaAtual.includes("POST") && (
          <button
            onClick={handleAddUsuario}
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
            Adicionar Usuário
          </button>
        )}

        {usuarios.length === 0 ? (
          <p>Nenhum usuário encontrado.</p>
        ) : (
          <Grid
            data={filterUsuarios()}
            columns={columns}
            columnMap={{
              ID: "idUsuario",
              Nome: "nomeUsuario",
              Email: "emailUsuario",
              Telefone: "telefoneUsuario",
              Login: "login",
            }}
            idKey="idUsuario"
            handleDelete={handleDeleteUsuario}
            handleEdit={handleEditUsuario}
            actions={actions}
            showActionsColumn={showActionsColumn}
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

export default ListagemUsuarios;
