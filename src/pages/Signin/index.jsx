import React, { useState } from "react";
import axios from 'axios';
import Input from "../../components/Input";
import Button from "../../components/Button";
import * as C from "./styles";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth"; // Agora o hook de autenticação

const Signin = () => {
  const { login } = useAuth();  // Acessando a função de login do contexto
  const navigate = useNavigate();

  const [loginInput, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Estado para a mensagem de sucesso

  const handleLogin = async (event) => {
    event.preventDefault();

    const loginData = {
      login: loginInput,        // Seu campo de login
      senhaUsuario: senha,      // Campo de senha
    };

    try {
      const response = await axios.post("http://localhost:8080/auth/login", loginData);

      if (response.data && response.data.token) {
        const token = response.data.token;

        // Exibe o token no console
        console.log("Token: ", token);

        // Armazenando o token no localStorage
        localStorage.setItem("token", token);

        // Configura o cabeçalho Authorization com o Bearer Token
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Chama a função de login do contexto
        login(token);

        // Redireciona para a página principal após o login bem-sucedido
        navigate("/home");
      } else {
        setError("Erro de autenticação. Verifique suas credenciais.");
      }
    } catch (error) {
      if (error.response) {
        console.error("Erro na resposta do backend:", error.response.data);
        console.error("Status:", error.response.status);
        setError("Erro de autenticação. Verifique suas credenciais.");
      } else {
        console.error("Erro ao realizar login:", error.message);
        setError("Erro ao tentar se conectar com o servidor.");
      }
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
          onChange={(e) => [setLogin(e.target.value), setError("")]} // Limpa a mensagem de erro
        />
        <Input
          type="password"
          placeholder="Digite sua Senha"
          value={senha}
          onChange={(e) => [setSenha(e.target.value), setError("")]} // Limpa a mensagem de erro
        />
        {error && <C.labelError>{error}</C.labelError>} {/* Mensagem de erro */}
        {successMessage && <C.labelSuccess>{successMessage}</C.labelSuccess>} {/* Mensagem de sucesso */}
        <Button Text="Entrar" onClick={handleLogin} />
        <C.LabelSignup>
          Não tem uma conta?
          <C.Strong>
            <Link to="/signup">&nbsp;Registre-se</Link>
          </C.Strong>
        </C.LabelSignup>
      </C.Content>
    </C.Container>
  );
};

export default Signin;
