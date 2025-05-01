// src/routes/index.jsx
import React, { Fragment, useEffect, useState, Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Sidebar from "../components/Sidebar";

// Páginas da aplicação com carregamento dinâmico
const AddCliente = lazy(() => import("../pages/AddCliente"));
const AddConta = lazy(() => import("../pages/AddConta"));
const AddFornecedor = lazy(() => import("../pages/AddFornecedor"));
const AddProduto = lazy(() => import("../pages/AddProduto"));
const AddUsuario = lazy(() => import("../pages/AddUsuario"));
const EditCliente = lazy(() => import("../pages/EditCliente"));
const EditConta = lazy(() => import("../pages/EditConta"));
const EditFornecedor = lazy(() => import("../pages/EditFornecedor"));
const EditProduto = lazy(() => import("../pages/EditProduto"));
const EditUsuario = lazy(() => import("../pages/EditUsuario"));
const Home = lazy(() => import("../pages/Home"));
const ListagemClientes = lazy(() => import("../pages/ListagemClientes"));
const ListagemFornecedor = lazy(() => import("../pages/ListagemFornecedor"));
const ListagemProdutos = lazy(() => import("../pages/ListagemProdutos"));
const Pagamentos = lazy(() => import("../pages/Pagamentos"));
const PagarConta = lazy(() => import("../pages/PagarConta"));
const Recarga = lazy(() => import("../pages/Recarga"));
const Signin = lazy(() => import("../pages/Signin"));
const SwaggerPage = lazy(() => import("../pages/Swagger"));
const Vendas = lazy(() => import("../pages/Vendas"));
const Entrada = lazy(() => import("../pages/Entrada"));
const Saida = lazy(() => import("../pages/Saida"));
const ListagemUsuarios = lazy(() => import("../pages/ListagemUsuarios"));
const NaoAutorizado = lazy(() => import("../pages/NaoAutorizado"));
const CadastroTela = lazy(() => import("../pages/CadastroTela"));

import PermissaoRoute from "./PermissaoRoute";

// Wrappers de segurança
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }
  return children;
};

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

        <Suspense fallback={<div>Loading...</div>}>
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
                  <PermissaoRoute tela="Tela de Usuarios">
                    <ListagemUsuarios />
                  </PermissaoRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/usuarios/adicionar"
              element={
                <ProtectedRoute>
                  <PermissaoRoute tela="Tela de Usuarios">
                    <AddUsuario />
                  </PermissaoRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/usuarios/editar/:id"
              element={
                <ProtectedRoute>
                  <PermissaoRoute tela="Tela de Usuarios">
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
            <Route
              path="/telas"
              element={
                <ProtectedRoute>
                  <CadastroTela />
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
        </Suspense>
      </Fragment>
    </BrowserRouter>
  );
};

export default RoutesApp;
