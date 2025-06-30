import React, { useState } from "react";
import axios from 'axios';
import * as C from "./styles";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import jwtDecode from "jwt-decode";
import imgLogin from "../../pages/Signin/login-image.png"; // ajuste o caminho conforme sua estrutura

const Signin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loginInput, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/auth/login", {
        login: loginInput,
        senhaUsuario: senha,
      });

      const token = response.data.token;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.sub;

      const userResponse = await axios.get(`http://localhost:8080/usuario/id/${loginInput}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userIdFromResponse = userResponse.data;

      if (!userIdFromResponse || typeof userIdFromResponse !== "number") {
        setError("Usuário não encontrado");
        return;
      }

      const permResponse = await axios.get(`http://localhost:8080/permissao/telas/${userIdFromResponse}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const permissoes = permResponse.data;
      localStorage.setItem("permissoes", JSON.stringify(permissoes));
      login(token);

      const tela = permissoes.find(p => p.permissoes.includes("GET"));
      navigate(tela?.urlTela || "/nao-autorizado");

    } catch (err) {
      setError("Erro ao realizar o login.");
    }
  };

  return (
    <C.Wrapper>
      <C.Left>
        <img src={imgLogin} alt="Login Ilustração" />
      </C.Left>
      <C.Right>
        <C.FormBox>
          <h2>LOGIN</h2>
          <div className="inputs">
            <label htmlFor="usuario">Usuário</label>
            <C.LoginInput
              id="usuario"
              type="text"
              placeholder="Digite seu usuário"
              value={loginInput}
              onChange={(e) => setLogin(e.target.value)}
            />

            <label htmlFor="senha">Senha</label>
            <C.LoginInput
              id="senha"
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>
          {error && <C.labelError>{error}</C.labelError>}
          <Button Text="Entrar" onClick={handleLogin} />
        </C.FormBox>
      </C.Right>
    </C.Wrapper>
  );
};

export default Signin;
