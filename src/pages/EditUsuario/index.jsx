import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import * as C from "./styles";

const telas = ["clientes", "produtos", "fornecedores", "usuarios"];
const acoes = ["adicionar", "editar", "excluir"];

const EditUsuario = () => {
  const { id } = useParams();  // Obtemos o ID do usuário da URL
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [permissoes, setPermissoes] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
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

        const response = await axios.get(
          `http://localhost:8080/usuario/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { nome, email, telefone, permissoes } = response.data;

        setNome(nome);
        setEmail(email);
        setTelefone(telefone);
        setPermissoes(permissoes);  // Carrega as permissões existentes
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
        alert("Erro ao carregar dados do usuário.");
      }
    };

    fetchUserData();
  }, [id, navigate]);

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

      const response = await axios.put(
        `http://localhost:8080/usuario/${id}`,
        {
          nome,
          email,
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
        alert("Usuário editado com sucesso!");
        setTimeout(() => {
          navigate("/usuarios");
        }, 1500);
      }
    } catch (error) {
      console.error("Erro ao editar usuário:", error);
      alert("Erro ao editar usuário.");
    }
  };

  return (
    <C.Container>
      <C.Title>Editar Usuário</C.Title>
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
                        checked={permissoes[tela]?.[acao] || false}
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

        <C.Button type="submit">Editar Usuário</C.Button>
      </C.Form>
    </C.Container>
  );
};

export default EditUsuario;
