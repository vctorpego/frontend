import React, { useState } from "react";
import axios from 'axios';
import Input from "../../components/Input";
import Button from "../../components/Button";
import * as C from "./styles";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth"; // Já tem esse hook
import jwtDecode from "jwt-decode";

const Signin = () => {
  const { login } = useAuth(); // Obtendo o login do contexto
  const navigate = useNavigate();

  const [loginInput, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

        // Acessar as permissões após o login
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.sub;

        // 1. Obter o ID do usuário
        const responseUser = await axios.get(`http://localhost:8080/usuario/id/${loginInput}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const userIdFromResponse = responseUser.data; // Agora, a resposta é apenas o ID

        // Verifique se o valor retornado é um número e é válido
        if (typeof userIdFromResponse === "number" && userIdFromResponse > 0) {
        } else {
          setError("Usuário não encontrado ou ID inválido.");
          return;
        }

        // 2. Usar o ID do usuário para buscar as permissões
        const responsePermissoes = await axios.get(`http://localhost:8080/permissao/telas/${userIdFromResponse}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const permissoes = responsePermissoes.data;

        // Verificação das permissões para cada tela
        if (permissoes.find(p => p.tela === 'Tela de Dashboard' && p.permissoes.includes('GET'))) {
          navigate("/home");
        } else if (permissoes.find(p => p.tela === 'Tela de Produtos' && p.permissoes.includes('GET'))) {
          navigate("/produtos");
        } else if (permissoes.find(p => p.tela === 'Tela de Fornecedores' && p.permissoes.includes('GET'))) {
          navigate("/fornecedores");
        } else if (permissoes.find(p => p.tela === 'Tela de Clientes' && p.permissoes.includes('GET'))) {
          navigate("/clientes");
        } else if (permissoes.find(p => p.tela === 'Tela de Recarga' && p.permissoes.includes('GET'))) {
          navigate("/recarga");
        } else if (permissoes.find(p => p.tela === 'Tela de Vendas' && p.permissoes.includes('GET'))) {
          navigate("/vendas");
        } else if (permissoes.find(p => p.tela === 'Tela de Pagamentos' && p.permissoes.includes('GET'))) {
          navigate("/pagamentos");
        } else if (permissoes.find(p => p.tela === 'Tela de Relatórios' && p.permissoes.includes('GET'))) {
          navigate("/relatorios");
        } else if (permissoes.find(p => p.tela === 'Tela Usuarios' && p.permissoes.includes('GET'))) {
          navigate("/usuarios");
        } else if (permissoes.find(p => p.tela === 'Tela de Entrada' && p.permissoes.includes('GET'))) {
          navigate("/entrada");
        } else if (permissoes.find(p => p.tela === 'Tela de Saída' && p.permissoes.includes('GET'))) {
          navigate("/saida");
        } else {
          navigate("/"); // Caso o usuário não tenha permissão específica
        }

        login(token); // Atualiza o estado de login aqui
      } else {
        setError("Erro de autenticação. Verifique suas credenciais.");
      }
    } catch (error) {
      console.error("Erro ao realizar login:", error);
      setError("Erro ao tentar se conectar com o servidor.");
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
          onChange={(e) => [setLogin(e.target.value), setError("")]}
        />
        <Input
          type="password"
          placeholder="Digite sua Senha"
          value={senha}
          onChange={(e) => [setSenha(e.target.value), setError("")]}
        />
        {error && <C.labelError>{error}</C.labelError>}
        <Button Text="Entrar" onClick={handleLogin} />
      </C.Content>
    </C.Container>
  );
};

export default Signin;
