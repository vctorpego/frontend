import React, { useState, useEffect } from "react";
import axios from "axios";
import Grid from "../../components/GridCliente"; // Tabela com os clientes
import Sidebar from "../../components/Sidebar";  // Sidebar com menu
import ModalExcluir from "../../components/ModalExcluir"; // Modal de confirmação de exclusão
import { useNavigate } from "react-router-dom";  // Navegação
import * as C from "./styles";  // Importando os estilos

const ListagemClientes = () => {
  const [clientes, setClientes] = useState([]);  // Lista de clientes
  const [user, setUser] = useState(null);  // Dados do usuário
  const [openModalExcluir, setOpenModalExcluir] = useState(false);  // Estado para modal
  const [clienteExcluir, setClienteExcluir] = useState(null);  // Cliente a ser excluído
  const navigate = useNavigate();

  // Função para buscar os dados do usuário e dos clientes
  useEffect(() => {
    // Buscar dados do usuário
    axios
      .get("http://localhost:8080/usuario")  // Supondo que exista uma rota de usuário
      .then(({ data }) => setUser(data))
      .catch((err) => console.error("Erro ao buscar dados do usuário:", err));

    // Buscar clientes
    axios
      .get("http://localhost:8080/cliente")
      .then(({ data }) => setClientes(data))
      .catch((err) => {
        console.error("Erro ao buscar clientes", err);
        //navigate("/auth/login");  // Redireciona se der erro
      });
  }, []);  // Executa uma vez quando o componente é montado

  // Função para excluir cliente
  const handleDeleteCliente = (clienteId) => {
    setClienteExcluir(clienteId);
    setOpenModalExcluir(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/cliente/${clienteExcluir}`);
      setClientes((prevClientes) =>
        prevClientes.filter((cliente) => cliente.id !== clienteExcluir)
      );
      setOpenModalExcluir(false);
      setClienteExcluir(null);
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
    }
  };

  const handleCloseModal = () => {
    setOpenModalExcluir(false);
    setClienteExcluir(null);
  };

  const columns = ["Nome", "ID", "Saldo", "Status", "Valor Gasto", "Ultima Compra"];  // Colunas da tabela

  return (
    <C.Container>
      {/* Sidebar com dados do usuário */}
      <Sidebar user={user} />

      <C.Content>
        <C.Title>Lista de Clientes</C.Title>
        <Grid
          data={clientes}
          columns={columns}
          handleDelete={handleDeleteCliente}
          handleEdit={() => {}}
        />
        <ModalExcluir
          open={openModalExcluir}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
        />
      </C.Content>
    </C.Container>
  );
};

export default ListagemClientes;
