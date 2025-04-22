import { Fragment, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import useAuth from "../hooks/useAuth"; // Hook de autenticação
import Sidebar from "../components/Sidebar"; // Sidebar

// Páginas da aplicação
import AddCliente from "../pages/AddCliente";
import AddConta from "../pages/AddConta";
import AddFornecedor from "../pages/AddFornecedor";
import AddProduto from "../pages/AddProduto";
import AddUsuario from "../pages/AddUsuario";
import EditCliente from "../pages/EditCliente";
import EditConta from "../pages/EditConta";
import EditFornecedor from "../pages/EditFornecedor";
import EditProduto from "../pages/EditProduto";
import EditUsuario from "../pages/EditUsuario";
import Home from "../pages/Home";
import ListagemClientes from "../pages/ListagemClientes";
import ListagemFornecedor from "../pages/ListagemFornecedor";
import ListagemProdutos from "../pages/ListagemProdutos";
import Pagamentos from "../pages/Pagamentos";
import PagarConta from "../pages/PagarConta";
import Recarga from "../pages/Recarga";
import Signin from "../pages/Signin";
import SwaggerPage from "../pages/Swagger";
import Vendas from "../pages/Vendas";
import Entrada from "../pages/Entrada";
import Saida from "../pages/Saida";
import ListagemUsuarios from "../pages/ListagemUsuarios";

const RoutesApp = () => {
  const { token, user, signout } = useAuth(); // Pega o token e o usuário do contexto de autenticação
  const [isSidebarVisible, setSidebarVisible] = useState(!!token); // Controle da visibilidade do Sidebar

  // Atualiza a visibilidade do Sidebar quando o token muda
  useEffect(() => {
    setSidebarVisible(!!token); 
  }, [token]);

  return (
    <BrowserRouter>
      <Fragment>
        {/* Renderiza o Sidebar somente se o token estiver presente */}
        {isSidebarVisible && <Sidebar user={user} handleLogout={signout} />}

        <Routes>
          <Route exact path="/home" element={token ? <Home /> : <Navigate to="/auth/login" />} />
          
          {/* Rotas de Clientes */}
          <Route exact path="/clientes" element={token ? <ListagemClientes /> : <Navigate to="/auth/login" />} />
          <Route exact path="/clientes/adicionar" element={token ? <AddCliente /> : <Navigate to="/auth/login" />} />
          <Route exact path="/clientes/editar/:idCliente" element={token ? <EditCliente /> : <Navigate to="/auth/login" />} />

          {/* Rotas de Fornecedores */}
          <Route exact path="/fornecedores" element={token ? <ListagemFornecedor /> : <Navigate to="/auth/login" />} />
          <Route exact path="/fornecedores/adicionar" element={token ? <AddFornecedor /> : <Navigate to="/auth/login" />} />
          <Route exact path="/fornecedores/editar/:idFornecedor" element={token ? <EditFornecedor /> : <Navigate to="/auth/login" />} />

          {/* Rotas de Pagamentos */}
          <Route exact path="/pagamentos" element={token ? <Pagamentos /> : <Navigate to="/auth/login" />} />
          <Route exact path="/pagamentos/adicionar" element={token ? <AddConta /> : <Navigate to="/auth/login" />} />
          <Route exact path="/pagamentos/editar/:idConta" element={token ? <EditConta /> : <Navigate to="/auth/login" />} />
          <Route exact path="/pagamentos/pagar/:id" element={token ? <PagarConta /> : <Navigate to="/auth/login" />} />

          {/* Rotas de Produtos */}
          <Route exact path="/produtos" element={token ? <ListagemProdutos /> : <Navigate to="/auth/login" />} />
          <Route exact path="/produtos/adicionar" element={token ? <AddProduto /> : <Navigate to="/auth/login" />} />
          <Route exact path="/produtos/editar/:idProduto" element={token ? <EditProduto /> : <Navigate to="/auth/login" />} />

          {/* Outras rotas */}
          <Route exact path="/recarga" element={token ? <Recarga /> : <Navigate to="/auth/login" />} />
          <Route exact path="/usuarios" element={token ? <ListagemUsuarios /> : <Navigate to="/auth/login" />} />
          <Route exact path="/usuarios/adicionar" element={token ? <AddUsuario /> : <Navigate to="/auth/login" />} />
          <Route exact path="/usuarios/editar/:idUsuario" element={token ? <EditUsuario /> : <Navigate to="/auth/login" />} />
          
          {/* Swagger */}
          <Route exact path="/swagger" element={token ? <SwaggerPage /> : <Navigate to="/auth/login" />} />

          {/* Entradas e Saídas */}
          <Route exact path="/entrada" element={token ? <Entrada /> : <Navigate to="/auth/login" />} />
          <Route exact path="/saida" element={token ? <Saida /> : <Navigate to="/auth/login" />} />
          
          {/* Vendas */}
          <Route exact path="/vendas" element={token ? <Vendas /> : <Navigate to="/auth/login" />} />

          {/* Caso a URL não seja encontrada, redireciona para o login */}
          <Route path="*" element={<Signin />} />
        </Routes>
      </Fragment>
    </BrowserRouter>
  );
};

export default RoutesApp;
