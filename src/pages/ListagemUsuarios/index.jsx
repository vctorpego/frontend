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
      console.error("Erro ao decodificar token:", error);
      localStorage.removeItem("token");
      navigate("/auth/login");
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
    const token = getToken();
    if (!token) return;

    axios
      .get("http://localhost:8080/usuario", getRequestConfig())
      .then(({ data }) => {
        setUsuarios(data);
      })
      .catch((err) => {
        console.error("Erro ao buscar usuários", err);
      });
  }, [navigate]);

  const filterUsuarios = () => {
    if (!searchQuery) return usuarios;
    return usuarios.filter((usuario) =>
      usuario.nomeUsuario.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleDeleteUsuario = (usuarioId) => {
    setUsuarioExcluir(usuarioId);
    setOpenModalExcluir(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = getToken();
      if (!token) return;

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
      console.error("Erro ao deletar usuário:", error);
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
  const actions = ["edit", "delete"];

  return (
    <C.Container>
      <Sidebar user={user} />
      <C.Content>
        <C.Title>Lista de Funcionários</C.Title>

        <SearchBar input={searchQuery} setInput={setSearchQuery} />

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
          Adicionar Funcionário
        </button>

        {usuarios.length === 0 ? (
          <p>Nenhum funcionário encontrado.</p>
        ) : (
          <Grid
            data={filterUsuarios()}
            columns={columns}
            columnMap={{
              "ID": "idUsuario",
              "Nome": "nomeUsuario",
              "Email": "emailUsuario",
              "Telefone": "telefoneUsuario",
              "Login": "login",
            }}
            idKey="idUsuario"
            handleDelete={handleDeleteUsuario}
            handleEdit={handleEditUsuario}
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

export default ListagemUsuarios;
