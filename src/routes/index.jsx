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
import EditFornecedor from "../pages/EditFornecedor";
import EditCliente from "../pages/EditCliente";
import AddFornecedor from "../pages/AddFornecedor";
import PagarConta from "../pages/PagarConta";
import AddConta from "../pages/AddConta";
import EditConta from "../pages/EditConta";
import Vendas from "../pages/Vendas";
import Entrada from "../pages/Entrada";

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
            path="/pagamentos/pagar/:id"
            element={token ? <PagarConta /> : <Navigate to="/auth/login" />}
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
          <Route
            exact
            path="/pagamentos/adicionar"
            element={token ? <AddConta /> : <Navigate to="/auth/login" />}
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
            path="/fornecedores/adicionar"
            element={token ? <AddFornecedor /> : <Navigate to="/auth/login" />}
          />
          <Route
            exact
            path="/pagamentos/editar/:idConta"
            element={token ? <EditConta /> : <Navigate to="/auth/login" />}
          />

          <Route
            exact
            path="/clientes/editar/:idCliente"
            element={token ? <EditCliente /> : <Navigate to="/auth/login" />}
          />

          <Route
            exact
            path="/produtos/editar/:idProduto"
            element={token ? <EditProduto /> : <Navigate to="/auth/login" />}
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
            path="/vendas"
            element={token ? <Vendas /> : <Navigate to="/auth/login" />}
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