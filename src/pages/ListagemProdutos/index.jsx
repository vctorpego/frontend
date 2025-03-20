import React, { useState, useEffect } from "react";
import axios from "axios";
import Grid from "../../components/Grid"; // Tabela com os produtos
import Sidebar from "../../components/Sidebar";  // Sidebar com menu
import ModalExcluir from "../../components/ModalExcluir"; // Modal de confirmação de exclusão
import { useNavigate } from "react-router-dom";  // Navegação
import * as C from "./styles";  // Importando os estilos

const ListagemProdutos = () => {
  const [produtos, setProdutos] = useState([]);  // Lista de produtos
  const [user, setUser] = useState(null);  // Dados do usuário
  const [openModalExcluir, setOpenModalExcluir] = useState(false);  // Estado para modal
  const [produtoExcluir, setProdutoExcluir] = useState(null);  // Produto a ser excluído
  const navigate = useNavigate();

  // Função para buscar os dados do usuário e dos produtos
  useEffect(() => {
    // Buscar dados do usuário
    axios
      .get("http://localhost:8800/usuario")  // Supondo que exista uma rota de usuário
      .then(({ data }) => setUser(data))
      .catch((err) => console.error("Erro ao buscar dados do usuário:", err));

    // Buscar produtos
    axios
      .get("http://localhost:8800/produtos")
      .then(({ data }) => setProdutos(data))
      .catch((err) => {
        console.error("Erro ao buscar produtos", err);
        navigate("/auth/login");  // Redireciona se der erro
      });
  }, []);  // Executa uma vez quando o componente é montado

  // Função para excluir produto
  const handleDeleteProduto = (produtoId) => {
    setProdutoExcluir(produtoId);
    setOpenModalExcluir(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8800/produtos/${produtoExcluir}`);
      setProdutos((prevProdutos) =>
        prevProdutos.filter((produto) => produto.id !== produtoExcluir)
      );
      setOpenModalExcluir(false);
      setProdutoExcluir(null);
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
    }
  };

  const handleCloseModal = () => {
    setOpenModalExcluir(false);
    setProdutoExcluir(null);
  };

  const columns = ["Nome", "ID", "Categoria", "Preço", "Estoque", "Fornecedor"];  // Colunas da tabela

  return (
    <C.Container>
      {/* Sidebar com dados do usuário */}
      <Sidebar user={user} />

      <C.Content>
        <C.Title>Lista de Produtos</C.Title>
        <Grid
          data={produtos}
          columns={columns}
          handleDelete={handleDeleteProduto}
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

export default ListagemProdutos;
