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

const ListagemUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [user, setUser] = useState(null);
  const [openModalExcluir, setOpenModalExcluir] = useState(false);
  const [usuarioExcluir, setUsuarioExcluir] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userPermissions, setUserPermissions] = useState([]);
  const [permissoesTelaAtual, setPermissoesTelaAtual] = useState([]);
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

    axios
      .get("http://localhost:8080/usuario", getRequestConfig())
      .then(({ data }) => {
        setUsuarios(data);
      })
      .catch((err) => {
        console.error("Erro ao buscar usuários:", err);
      });

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
      setMessageType("success");
      setMessage("Usuario excluido com sucesso!");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
      handleCloseModal();

    } catch (error) {
      if (error.response?.status === 409) {
        setMessageType("error");
        setMessage("Você não pode excluir o próprio usuário!");
        setTimeout(() => {
          setMessage("");
          setMessageType("");
        }, 3000);
        handleCloseModal();

      } else {
        console.error("Erro ao deletar usuário:", error);
        setMessageType("error");
        setMessage("Ocorreu um erro ao deletar o usuário!");
        setTimeout(() => {
          setMessage("");
          setMessageType("");
        }, 3000);
        handleCloseModal();
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
      <C.Header>
        <C.Title>Lista de Usuários</C.Title>
        {permissoesTelaAtual.includes("POST") && (
          <C.AddButtonWrapper>
            <Button Text="Adicionar" onClick={handleAddUsuario} />
          </C.AddButtonWrapper>
        )}
      </C.Header>

      {message && <Message type={messageType}>{message}</Message>}

      <SearchBar input={searchQuery} setInput={setSearchQuery} />

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
    </C.Container>
  );
};

export default ListagemUsuarios;
