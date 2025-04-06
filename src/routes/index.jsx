import { Fragment } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import useAuth from "../hooks/useAuth";

import AddCliente from "../pages/AddCliente";
import AddConta from "../pages/AddConta";
import AddFornecedor from "../pages/AddFornecedor";
import AddProduto from "../pages/AddProduto";
import EditCliente from "../pages/EditCliente";
import EditConta from "../pages/EditConta";
import EditFornecedor from "../pages/EditFornecedor";
import EditProduto from "../pages/EditProduto";
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

const RoutesApp = () => {
  const { token } = useAuth(); // Pega o token do contexto de autenticação

  return (
    <BrowserRouter>
      <Fragment>
        <Routes>
          {/* Home sempre primeiro */}
          <Route
            exact
            path="/home"
            element={token ? <Home /> : <Navigate to="/auth/login" />}
          />

          {/* Rotas em ordem alfabética */}
          <Route
            exact
            path="/clientes"
            element={token ? <ListagemClientes /> : <Navigate to="/auth/login" />}
          />
          <Route
            exact
            path="/clientes/adicionar"
            element={token ? <AddCliente /> : <Navigate to="/auth/login" />}
          />
          <Route
             exact
             path="/clientes/editar/:idCliente"
             element={token ? <EditCliente /> : <Navigate to="/auth/login" />}
          />
          <Route
            exact
            path="/fornecedores"
            element={token ? <ListagemFornecedor /> : <Navigate to="/auth/login" />}
          />
          <Route
            exact
            path="/fornecedores/adicionar"
            element={token ? <AddFornecedor /> : <Navigate to="/auth/login" />}
          />
          <Route
             exact
             path="/fornecedores/editar/:idFornecedor"
             element={token ? <EditFornecedor /> : <Navigate to="/auth/login" />}
          />
          <Route
            exact
            path="/pagamentos"
            element={token ? <Pagamentos /> : <Navigate to="/auth/login" />}
          />
          <Route
            exact
            path="/pagamentos/adicionar"
            element={token ? <AddConta /> : <Navigate to="/auth/login" />}
          />
          <Route
            exact
            path="/pagamentos/editar/:idConta"
            element={token ? <EditConta /> : <Navigate to="/auth/login" />}
          />
          <Route
            exact
            path="/pagamentos/pagar/:id"
            element={token ? <PagarConta /> : <Navigate to="/auth/login" />}
          />
          <Route
            exact
            path="/produtos"
            element={token ? <ListagemProdutos /> : <Navigate to="/auth/login" />}
          />
          <Route
            exact
            path="/produtos/adicionar"
            element={token ? <AddProduto /> : <Navigate to="/auth/login" />}
          />
          <Route
            exact
            path="/produtos/editar/:idProduto"
            element={token ? <EditProduto /> : <Navigate to="/auth/login" />}
          />
          <Route
            exact
            path="/recarga"
            element={token ? <Recarga /> : <Navigate to="/auth/login" />}
          />
          <Route
            exact
            path="/swagger"
            element={<SwaggerPage />}
          />
          <Route
            exact
            path="/fornecedores/editar/:idFornecedor"
            element={token ? <EditFornecedor /> : <Navigate to="/auth/login" />}
          />
          <Route
            exact
            path="/entrada"
            element={token ? <Entrada /> : <Navigate to="/auth/login" />}
          />
          <Route
            exact
            path="/saida"
            element={token ? <Saida /> : <Navigate to="/auth/login" />}
          />
          <Route
            exact
            path="/vendas"
            element={token ? <Vendas /> : <Navigate to="/auth/login" />}
          />

          {/* Caso a URL não seja encontrada, redireciona para o login */}
          <Route path="*" element={<Signin />} />
        </Routes>
      </Fragment>
    </BrowserRouter>
  );
};

export default RoutesApp;