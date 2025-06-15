import React, { useState } from "react";
import axios from 'axios';
import Input from "../../components/Input";
import Button from "../../components/Button";
import * as C from "./styles";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth"; 
import jwtDecode from "jwt-decode";

const Signin = () => {
  const { login } = useAuth(); // Obtendo o login do contexto
  const navigate = useNavigate();

  const [loginInput, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    const loginData = {
      login: loginInput,
      senhaUsuario: senha,
    };

    try {
      const response = await axios.post("http://localhost:8080/auth/login", loginData);

      if (response.data && response.data.token) {
        const token = response.data.token;
        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Decodificar token para pegar userId
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.sub;

        // Obter o ID do usuário (confirmação)
        const responseUser = await axios.get(`http://localhost:8080/usuario/id/${loginInput}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userIdFromResponse = responseUser.data;

        if (typeof userIdFromResponse !== "number" || userIdFromResponse <= 0) {
          setError("Usuário não encontrado");
          return;
        }

        // Buscar permissões com base no ID do usuário
        const responsePermissoes = await axios.get(`http://localhost:8080/permissao/telas/${userIdFromResponse}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const permissoes = responsePermissoes.data;

        // Salvar permissões no localStorage para uso futuro
        localStorage.setItem("permissoes", JSON.stringify(permissoes));

        // Atualiza o estado global de autenticação antes da navegação
        login(token);

        // Procurar a primeira rota com permissão GET e navegar para ela
        const telaPermitida = permissoes.find(p => p.permissoes.includes("GET"));
        if (telaPermitida && telaPermitida.urlTela) {
          navigate(telaPermitida.urlTela);
        } else {
          // Caso não tenha nenhuma permissão, redireciona para página padrão ou acesso negado
          navigate("/nao-autorizado");
        }
      } else {
        setError("Erro de autenticação. Verifique suas credenciais.");
      }
    } catch (error) {
      console.error("Erro ao realizar login:", error);
      setError("Erro ao realizar o login.");
    }
  };

  return (
    <C.Container>
      <C.Label>LOGIN</C.Label>
      <C.Content>
        <Input
          type="text"
          placeholder="Digite seu Login"
          value={loginInput}
          onChange={(e) => { setLogin(e.target.value); setError(""); }}
        />
        <Input
          type="password"
          placeholder="Digite sua Senha"
          value={senha}
          onChange={(e) => { setSenha(e.target.value); setError(""); }}
        />
        {error && <C.labelError>{error}</C.labelError>}
        <Button Text="Entrar" onClick={handleLogin} />
      </C.Content>
    </C.Container>
  );
};

export default Signin;
