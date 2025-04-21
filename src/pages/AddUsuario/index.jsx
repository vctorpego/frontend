import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import * as C from "./styles";

const telas = ["clientes", "produtos", "fornecedores", "usuarios"];
const acoes = ["adicionar", "editar", "excluir"];

const AddUsuario = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const navigate = useNavigate();

  const initialPermissoes = telas.reduce((acc, tela) => {
    acc[tela] = acoes.reduce((acoesAcc, acao) => {
      acoesAcc[acao] = false;
      return acoesAcc;
    }, {});
    return acc;
  }, {});

  const [permissoes, setPermissoes] = useState(initialPermissoes);

  const handleCheckboxChange = (tela, acao) => {
    setPermissoes((prev) => ({
      ...prev,
      [tela]: {
        ...prev[tela],
        [acao]: !prev[tela][acao],
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome || !email || !senha || !telefone) {
      alert("Preencha todos os campos.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Você precisa estar logado!");
      navigate("/auth/login");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        alert("Token expirado. Faça login novamente.");
        localStorage.removeItem("token");
        navigate("/auth/login");
        return;
      }

      const response = await axios.post(
        "http://localhost:8080/usuario",
        {
          nome,
          email,
          senha,
          telefone,
          permissoes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Usuário adicionado com sucesso!");
        setTimeout(() => {
          navigate("/usuarios");
        }, 1500);
      }
    } catch (error) {
      console.error("Erro ao adicionar usuário:", error);
      if (error.response?.status === 409) {
        alert("Usuário já cadastrado.");
      } else {
        alert("Erro ao adicionar usuário.");
      }
    }
  };

  return (
    <C.Container>
      <C.Title>Adicionar Usuário</C.Title>
      <C.Form onSubmit={handleSubmit}>
        <C.InputGroup>
          <C.InputWrapper>
            <C.Label>Nome:</C.Label>
            <C.Input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: João"
              required
            />
          </C.InputWrapper>

          <C.InputWrapper>
            <C.Label>Telefone:</C.Label>
            <C.Input
              type="tel"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(00) 00000-0000"
              required
            />
          </C.InputWrapper>
        </C.InputGroup>

        <C.InputGroup>
          <C.InputWrapper>
            <C.Label>Email:</C.Label>
            <C.Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="joao@gmail.com"
              required
            />
          </C.InputWrapper>

          <C.InputWrapper>
            <C.Label>Senha:</C.Label>
            <C.Input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="****"
              required
            />
          </C.InputWrapper>
        </C.InputGroup>

        <div>
          <C.Label>Permissões:</C.Label>
          <C.PermissoesContainer>
            {telas.map((tela) => (
              <div key={tela}>
                <strong>{tela.charAt(0).toUpperCase() + tela.slice(1)}</strong>
                <C.CheckboxContainer>
                  {acoes.map((acao) => (
                    <C.CheckboxLabel key={`${tela}-${acao}`}>
                      <C.Checkbox
                        type="checkbox"
                        checked={permissoes[tela][acao]}
                        onChange={() => handleCheckboxChange(tela, acao)}
                      />
                      {acao}
                    </C.CheckboxLabel>
                  ))}
                </C.CheckboxContainer>
              </div>
            ))}
          </C.PermissoesContainer>
        </div>

        <C.Button type="submit">Adicionar Usuário</C.Button>
      </C.Form>
    </C.Container>
  );
};

export default AddUsuario;
