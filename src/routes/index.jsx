// src/routes/RoutesApp.js
import { Fragment } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import useAuth from "../hooks/useAuth"; // Importando o hook de autenticação
import Home from "../pages/Home";
import Signin from "../pages/Signin";
import ListagemClientes from "../pages/ListagemClientes";
import ListagemProdutos from "../pages/ListagemProdutos";
import ListagemFornecedor from "../pages/ListagemFornecedor";
import Pagamentos from "../pages/Pagamentos";
import AddProduto from "../pages/AddProduto"; // Importando a página AddProduto
import AddCliente from "../pages/AddCliente"; // Importando a página AddCliente
import { Navigate } from "react-router-dom";
import SwaggerPage from "../pages/Swagger"; // Importando a página Swagger
import EditProduto from "../pages/EditProduto";
// import Pagamentos from "../pages/Pagamentos";

const RoutesApp = () => {
  const { token } = useAuth(); // Pega o token do contexto de autenticação

  return (
    <BrowserRouter>
      <Fragment>
        <Routes>
          {/* Rota privada - só acessível se estiver logado */}
          <Route
            exact
            path="/home"
            element={token ? <Home /> : <Navigate to="/auth/login" />}
          />
          <Route
            exact
            path="/fornecedores"
            element={token ? <ListagemFornecedor /> : <Navigate to="/auth/login" />}
          />
          <Route
            exact
            path="/clientes"
            element={token ? <ListagemClientes /> : <Navigate to="/auth/login" />}
          />

          <Route
            exact
            path="/produtos"
            element={token ? <ListagemProdutos /> : <Navigate to="/auth/login" />}
          />

          <Route
            exact
            path="/pagamentos"
            element={token ? <Pagamentos /> : <Navigate to="/auth/login" />}
          />

          {/* Adicionando a rota para adicionar cliente */}
          <Route
            exact
            path="/clientes/adicionar"
            element={token ? <AddCliente /> : <Navigate to="/auth/login" />}
          />

          <Route
            exact
            path="/produtos/adicionar"
            element={token ? <AddProduto /> : <Navigate to="/auth/login" />}
          />

          <Route
            exact
            path="/produtos/editar/id"
            element={token ? <EditProduto /> : <Navigate to="/auth/login" />}
          />

          {/* Rota para Swagger UI */}
          <Route path="/swagger" element={<SwaggerPage />} />

          {/* Caso a URL não seja encontrada, redireciona para o login */}
          <Route path="*" element={<Signin />} />
        </Routes>
      </Fragment>
    </BrowserRouter>
  );
};

export default RoutesApp;
