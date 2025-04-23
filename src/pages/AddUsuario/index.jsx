import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import * as C from "./styles";

const telas = [
  { nome: "Dashboard", id: 1 },
  { nome: "Produtos", id: 2 },
  { nome: "Fornecedores", id: 3 },
  { nome: "Clientes", id: 4 },
  { nome: "Recarga", id: 5 },
  { nome: "Vendas", id: 6 },
  { nome: "Pagamentos", id: 7 },
  { nome: "Relatórios", id: 8 },
  { nome: "Entrada", id: 9 },
  { nome: "Saída", id: 10 },
  { nome: "Usuarios", id: 11 },
];

const acoes = {
  adicionar: 1,  // POST
  editar: 2,     // PUT
  excluir: 3,    // DELETE
  visualizar: 4, // GET
};

const AddUsuario = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [login, setLogin] = useState("");
  const [permissoes, setPermissoes] = useState(
    telas.reduce((acc, tela) => {
      acc[tela.nome] = {
        adicionar: false,
        editar: false,
        excluir: false,
        visualizar: false,
      };
      return acc;
    }, {})
  );

  const navigate = useNavigate();

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
  
    if (!nome || !email || !senha || !telefone || !login) {
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
  
      // Enviar os dados do usuário para criação
      const response = await axios.post(
        "http://localhost:8080/usuario",
        {
          emailUsuario: email,
          telefoneUsuario: telefone,
          nomeUsuario: nome,
          login: login,
          senhaUsuario: senha,
          usuarioPermissaoTelaListUsuario: []  // Array vazio de permissões
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("Resposta do backend:", response); // Verificar resposta
  
      if (response.status === 200 || response.status === 201) {
        alert("Usuário adicionado com sucesso!");
  
        const usuarioId = response.data.idUsuario; // Atualizado para o campo correto
  
        if (!usuarioId) {
          throw new Error("ID do usuário não retornado.");
        }
  
        // Após criar o usuário, associe as permissões
        for (const tela of telas) {
          for (const acao in acoes) {
            if (permissoes[tela.nome][acao]) {
              // Enviar a permissão para o backend com os parâmetros corretos
              await axios.post(
                `http://localhost:8080/usuario/${usuarioId}/permissao`,
                null,
                {
                  params: {
                    idTela: tela.id, // Substituindo pela tela correta (Vendas, Entrada, etc.)
                    idPermissao: acoes[acao], // Passando o id da permissão correspondente
                  },
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
            }
          }
        }
  
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

        <C.InputGroup>
          <C.InputWrapper>
            <C.Label>Login:</C.Label>
            <C.Input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Ex: silva"
              required
            />
          </C.InputWrapper>
        </C.InputGroup>

        <div>
          <C.Label>Permissões:</C.Label>
          <C.PermissoesContainer>
            {telas.map((tela) => (
              <div key={tela.id}>
                <strong>{tela.nome}</strong>
                <C.CheckboxContainer>
                  {Object.keys(acoes).map((acao) => (
                    <C.CheckboxLabel key={`${tela.id}-${acao}`}>
                      <C.Checkbox
                        type="checkbox"
                        checked={permissoes[tela.nome][acao]}
                        onChange={() => handleCheckboxChange(tela.nome, acao)}
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
