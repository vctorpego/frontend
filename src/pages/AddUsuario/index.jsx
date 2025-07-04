import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from 'lucide-react';
import Button from "../../components/Button";
import * as C from "./styles";
import { Message } from "../AddProduto/styles";

const acoes = {
  adicionar: 1,
  editar: 2,
  excluir: 3,
  visualizar: 4,
};

const AddUsuario = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [login, setLogin] = useState("");
  const [telas, setTelas] = useState([]);
  const [permissoes, setPermissoes] = useState({});
  const [hasPermission, setHasPermission] = useState(false);
  const [isSuperAdm, setIsSuperAdm] = useState(false);
  const [adminChecked, setAdminChecked] = useState(false);
  const navigate = useNavigate();
  const [messageType, setMessageType] = useState("");
  const [message, setMessage] = useState("");

  const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth/login");
      return null;
    }

    try {
      const decoded = jwt_decode(token);
      if (decoded.exp < Date.now() / 1000) {
        localStorage.removeItem("token");
        navigate("/auth/login");
        return null;
      }
      return token;
    } catch (error) {
      console.error("Erro ao decodificar token:", error);
      localStorage.removeItem("token");
      navigate("/auth/login");
      return null;
    }
  };

  const getRequestConfig = () => {
    const token = localStorage.getItem("token");
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const decoded = jwt_decode(token);
    const userLogin = decoded.sub;

    const fetchData = async () => {
      try {

        const telaResponse = await axios.get("http://localhost:8080/tela", getRequestConfig());
        const telasBackend = telaResponse.data;
        setTelas(telasBackend);

        const permissoesIniciais = {};
        telasBackend.forEach((tela) => {
          permissoesIniciais[tela.nomeTela] = {
            adicionar: false,
            editar: false,
            excluir: false,
            visualizar: false,
          };
        });
        setPermissoes(permissoesIniciais);

        const usuarioResponse = await axios.get(
          `http://localhost:8080/usuario/id/${userLogin}`,
          getRequestConfig()
        );
        const userId = usuarioResponse.data;

        const permissionsResponse = await axios.get(
          `http://localhost:8080/permissao/telas/${userId}`,
          getRequestConfig()
        );

        const logadoResponse = await axios.get(
          `http://localhost:8080/usuario/${userId}`,
          getRequestConfig()
        );
        console.log("Esse é o usuario logado", logadoResponse.data);
        setIsSuperAdm(logadoResponse.data.isSuperAdm);

        setAdminChecked(false);

        const permissoesTela = permissionsResponse.data.find(
          (perm) => perm.tela === "Tela de Usuarios"
        );
        const permissoesAtuais = permissoesTela?.permissoes || [];

        const hasPostPermission = permissoesAtuais.includes("POST");
        setHasPermission(hasPostPermission);

        if (!hasPostPermission) {
          navigate("/nao-autorizado");
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, [navigate]);

  const toggleAllCheckboxes = (checked) => {
    const novaPermissao = {};
    const todasTelas = telas
      .filter((t) => t.nomeTela !== "Tela de Tela")
      .map((t) => t.nomeTela);

    if (isSuperAdm) todasTelas.push("Tela de Usuarios");

    todasTelas.forEach((tela) => {
      novaPermissao[tela] = {};
      Object.keys(acoes).forEach((acao) => {
        novaPermissao[tela][acao] = checked;
      });
    });
    setPermissoes(novaPermissao);
  };

  const handleAdminCheckboxChange = () => {
    const novoValor = !adminChecked;
    setAdminChecked(novoValor);
    toggleAllCheckboxes(novoValor);
  };

  const handleCheckboxChange = (telaNome, acao) => {
    setPermissoes((prevPermissoes) => {
      const telaPermissoes = prevPermissoes[telaNome] || {};
      const novaPermissaoAcao = !telaPermissoes[acao];

      const novasPermissoesTela = {
        ...telaPermissoes,
        [acao]: novaPermissaoAcao,
      };

      if (["adicionar", "editar", "excluir"].includes(acao) && novaPermissaoAcao) {
        novasPermissoesTela.visualizar = true;
      }

      return {
        ...prevPermissoes,
        [telaNome]: novasPermissoesTela,
      };
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome || !email || !senha || !telefone || !login) {
      setMessageType("error");
      setMessage("Preencha todos os campos!");
      return;
    }

    const token = getToken();
    if (!token) return;

    try {
      const response = await axios.post(
        "http://localhost:8080/usuario",
        {
          emailUsuario: email,
          telefoneUsuario: telefone,
          nomeUsuario: nome,
          login: login,
          senhaUsuario: senha,
          isAdm: adminChecked,
          isSuperAdm: false,
          usuarioPermissaoTelaListUsuario: [],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setMessageType("success");
        setMessage("Usuário adicionado com sucesso!");
        setTimeout(() => navigate("/usuarios"), 2000);
        const usuarioId = response.data.idUsuario;

        if (!usuarioId) {
          throw new Error("ID do usuário não retornado.");
        }

        const permissaoPromises = [];

        for (const tela of telas) {
          const telaNome = tela.nomeTela;
          for (const acao in acoes) {
            if (permissoes[telaNome]?.[acao]) {
              permissaoPromises.push(
                axios.post(
                  `http://localhost:8080/usuario/${usuarioId}/permissao`,
                  null,
                  {
                    params: {
                      idTela: tela.idTela,
                      idPermissao: acoes[acao],
                    },
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                )
              );
            }
          }
        }

        await Promise.all(permissaoPromises);

        setTimeout(() => {
          navigate("/usuarios");
        }, 1500);
      }
    } catch (error) {
      console.error("Erro ao adicionar usuário:", error);
      if (error.response?.status === 401) {
        setMessageType("error");
        setMessage("Usuário já cadastrado!");
        setTimeout(() => navigate("/usuarios"), 2000);

      } else {
        setMessageType("error");
        setMessage("Erro ao adicionar asuário!");
        setTimeout(() => navigate("/usuarios"), 2000);
      }
    }
  };

  if (!hasPermission) {
    return <div>Você não tem permissão para acessar esta página.</div>;
  }

  return (
    <C.Container>
      <C.BackButton onClick={() => navigate("/usuarios")}>
        <ArrowLeft size={20} /> Voltar
      </C.BackButton>
      <C.Title>Adicionar Usuário</C.Title>

      {message && <Message type={messageType}>{message}</Message>}

      <C.Form onSubmit={handleSubmit}>

        <C.InputsRow columns={2}>
          <C.InputGroup>
            <C.Label htmlFor="nome">Nome</C.Label>
            <C.Input
              id="nome"
              type="text"
              placeholder="Nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </C.InputGroup>
          <C.InputGroup>
            <C.Label htmlFor="email">Email</C.Label>
            <C.Input
              id="email"
              type="email"
              placeholder="email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </C.InputGroup>
        </C.InputsRow>

        <C.InputsRow columns={3}>
          <C.InputGroup>
            <C.Label htmlFor="telefone">Telefone</C.Label>
            <C.Input
              id="telefone"
              type="tel"
              placeholder="(XX) XXXX-XXXX"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
          </C.InputGroup>
          <C.InputGroup>
            <C.Label htmlFor="login">Login</C.Label>
            <C.Input
              id="login"
              type="text"
              placeholder="Nome de usuário"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          </C.InputGroup>
          <C.InputGroup>
            <C.Label htmlFor="senha">Senha</C.Label>
            <C.Input
              id="senha"
              type="password"
              placeholder="Senha segura"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </C.InputGroup>
        </C.InputsRow>

        {isSuperAdm && (
          <C.AdminCheckbox>
            <label>
              <input
                type="checkbox"
                checked={adminChecked}
                onChange={handleAdminCheckboxChange}
              />
              Administrador (Super Usuário)
            </label>
          </C.AdminCheckbox>
        )}

        <C.PermissionsSection>
          <h3>Permissões</h3>
          <C.CardsContainer>
            {telas
              .filter((tela) => tela.nomeTela !== "Tela de Tela")
              .map((tela) => (
                <C.Card key={tela.idTela}>
                  <C.CardTitle>{tela.nomeTela}</C.CardTitle>
                  <C.PermissionsList>
                    {Object.keys(acoes).map((acao) => (
                      <C.PermissionItem key={acao}>
                        <label>
                          <input
                            type="checkbox"
                            checked={permissoes[tela.nomeTela]?.[acao] || false}
                            onChange={() => handleCheckboxChange(tela.nomeTela, acao)}
                          />
                          {acao.charAt(0).toUpperCase() + acao.slice(1)}
                        </label>
                      </C.PermissionItem>
                    ))}
                  </C.PermissionsList>
                </C.Card>
              ))}
          </C.CardsContainer>
        </C.PermissionsSection>

        <C.AddButtonWrapper>
          <Button Text="Adicionar" onClick={handleSubmit} />
        </C.AddButtonWrapper>
      </C.Form>

    </C.Container>
  );
};

export default AddUsuario;
