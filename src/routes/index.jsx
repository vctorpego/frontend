// src/routes/RoutesApp.js
import { Fragment } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import useAuth from "../hooks/useAuth"; // Importando o hook de autenticação
import Home from "../pages/Home";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";
import ListagemClientes from "../pages/ListagemClientes";
import ListagemProdutos from "../pages/ListagemProdutos";
import { Navigate } from "react-router-dom";

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
            path="/cliente"
            element={token ? <ListagemClientes /> : <Navigate to="/auth/login" />}
          />

          <Route
            exact
            path="/produto"
            element={token ? <ListagemProdutos /> : <Navigate to="/auth/login" />}
          />


          {/* Rota pública */}
          <Route path="/" element={<Signin />} />
          <Route exact path="/signup" element={<Signup />} />

          {/* Caso a URL não seja encontrada, redireciona para o login */}
          <Route path="*" element={<Signin />} />
        </Routes>
      </Fragment>
    </BrowserRouter>
  );
};

export default RoutesApp;
