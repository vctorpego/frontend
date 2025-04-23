// src/routes/index.jsx
import React, { Fragment, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Sidebar from "../components/Sidebar";

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
import NaoAutorizado from "../pages/NaoAutorizado";

// Wrappers de segurança
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }
  return children;
};

import PermissaoRoute from "./PermissaoRoute";

const RoutesApp = () => {
  const { token, user, signout } = useAuth();
  const [isSidebarVisible, setSidebarVisible] = useState(!!token);

  useEffect(() => {
    setSidebarVisible(!!token);
  }, [token]);

  return (
    <BrowserRouter>
      <Fragment>
        {isSidebarVisible && <Sidebar user={user} handleLogout={signout} />}

        <Routes>
          {/* Home */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* Clientes */}
          <Route
            path="/clientes"
            element={
              <ProtectedRoute>
                <PermissaoRoute tela="Tela de Clientes">
                  <ListagemClientes />
                </PermissaoRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/clientes/adicionar"
            element={
              <ProtectedRoute>
                <PermissaoRoute tela="Tela de Clientes">
                  <AddCliente />
                </PermissaoRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/clientes/editar/:idCliente"
            element={
              <ProtectedRoute>
                <PermissaoRoute tela="Tela de Clientes">
                  <EditCliente />
                </PermissaoRoute>
              </ProtectedRoute>
            }
          />

          {/* Fornecedores */}
          <Route
            path="/fornecedores"
            element={
              <ProtectedRoute>
                <PermissaoRoute tela="Tela de Fornecedores">
                  <ListagemFornecedor />
                </PermissaoRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/fornecedores/adicionar"
            element={
              <ProtectedRoute>
                <PermissaoRoute tela="Tela de Fornecedores">
                  <AddFornecedor />
                </PermissaoRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/fornecedores/editar/:idFornecedor"
            element={
              <ProtectedRoute>
                <PermissaoRoute tela="Tela de Fornecedores">
                  <EditFornecedor />
                </PermissaoRoute>
              </ProtectedRoute>
            }
          />

          {/* Pagamentos */}
          <Route
            path="/pagamentos"
            element={
              <ProtectedRoute>
                <PermissaoRoute tela="Tela de Pagamentos">
                  <Pagamentos />
                </PermissaoRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/pagamentos/adicionar"
            element={
              <ProtectedRoute>
                <PermissaoRoute tela="Tela de Pagamentos">
                  <AddConta />
                </PermissaoRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/pagamentos/editar/:idConta"
            element={
              <ProtectedRoute>
                <PermissaoRoute tela="Tela de Pagamentos">
                  <EditConta />
                </PermissaoRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/pagamentos/pagar/:id"
            element={
              <ProtectedRoute>
                <PermissaoRoute tela="Tela de Pagamentos">
                  <PagarConta />
                </PermissaoRoute>
              </ProtectedRoute>
            }
          />

          {/* Produtos */}
          <Route
            path="/produtos"
            element={
              <ProtectedRoute>
                <PermissaoRoute tela="Tela de Produtos">
                  <ListagemProdutos />
                </PermissaoRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/produtos/adicionar"
            element={
              <ProtectedRoute>
                <PermissaoRoute tela="Tela de Produtos">
                  <AddProduto />
                </PermissaoRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/produtos/editar/:idProduto"
            element={
              <ProtectedRoute>
                <PermissaoRoute tela="Tela de Produtos">
                  <EditProduto />
                </PermissaoRoute>
              </ProtectedRoute>
            }
          />

          {/* Recarga */}
          <Route
            path="/recarga"
            element={
              <ProtectedRoute>
                <PermissaoRoute tela="Tela de Recarga">
                  <Recarga />
                </PermissaoRoute>
              </ProtectedRoute>
            }
          />

          {/* Usuários */}
          <Route
            path="/usuarios"
            element={
              <ProtectedRoute>
                <PermissaoRoute tela="Tela Usuarios">
                  <ListagemUsuarios />
                </PermissaoRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/usuarios/adicionar"
            element={
              <ProtectedRoute>
                <PermissaoRoute tela="Tela Usuarios">
                  <AddUsuario />
                </PermissaoRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/usuarios/editar/:idUsuario"
            element={
              <ProtectedRoute>
                <PermissaoRoute tela="Tela Usuarios">
                  <EditUsuario />
                </PermissaoRoute>
              </ProtectedRoute>
            }
          />

          {/* Swagger */}
          <Route
            path="/swagger"
            element={
              <ProtectedRoute>
                <PermissaoRoute tela="Tela de Relatórios">
                  <SwaggerPage />
                </PermissaoRoute>
              </ProtectedRoute>
            }
          />

          {/* Entradas e Saídas */}
          <Route
            path="/entrada"
            element={
              <ProtectedRoute>
                <PermissaoRoute tela="Tela de Entrada">
                  <Entrada />
                </PermissaoRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/saida"
            element={
              <ProtectedRoute>
                <PermissaoRoute tela="Tela de Saída">
                  <Saida />
                </PermissaoRoute>
              </ProtectedRoute>
            }
          />

          {/* Vendas */}
          <Route
            path="/vendas"
            element={
              <ProtectedRoute>
                <PermissaoRoute tela="Tela de Vendas">
                  <Vendas />
                </PermissaoRoute>
              </ProtectedRoute>
            }
          />

          {/* Não autorizado */}
          <Route path="/nao-autorizado" element={<NaoAutorizado />} />

          {/* Autenticação */}
          <Route path="/auth/login" element={<Signin />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to={token ? "/home" : "/auth/login"} />} />
        </Routes>
      </Fragment>
    </BrowserRouter>
  );
};

export default RoutesApp;
