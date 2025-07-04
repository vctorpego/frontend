import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from 'lucide-react';
import * as C from "./styles";
import Button from "../../components/Button";

const acoes = {
  adicionar: 1,
  editar: 2,
  excluir: 3,
  visualizar: 4,
};

const EditUsuario = () => {
  const { id } = useParams();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [login, setLogin] = useState("");
  const [permissoes, setPermissoes] = useState({});
  const [telas, setTelas] = useState([]);
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

    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(
          `http://localhost:8080/usuario/id/${userLogin}`,
          getRequestConfig()
        );

        const currentUserId = userResponse.data;
        const permissionsResponse = await axios.get(
          `http://localhost:8080/permissao/telas/${currentUserId}`,
          getRequestConfig()
        );
        const logadoResponse = await axios.get(
          `http://localhost:8080/usuario/${currentUserId}`,
          getRequestConfig()
        );

        console.log("Esse é o usuario a ser editado", logadoResponse.data);
        setIsSuperAdm(logadoResponse.data.isSuperAdm);

        const telaUsuarios = permissionsResponse.data.find(
          (perm) => perm.tela === "Tela de Usuarios"
        );

        const temPermissaoPUT = telaUsuarios?.permissoes?.includes("PUT") || false;
        setHasPermission(temPermissaoPUT);

        if (!temPermissaoPUT) {
          navigate("/nao-autorizado");
          return;
        }

        const userToEditResponse = await axios.get(
          `http://localhost:8080/usuario/${id}`,
          getRequestConfig()
        );

        const { nomeUsuario, emailUsuario, telefoneUsuario, login, isAdm } = userToEditResponse.data;
        setNome(nomeUsuario);
        setEmail(emailUsuario);
        setTelefone(telefoneUsuario);
        setLogin(login);
        setAdminChecked(isAdm);

        const permissoesUsuario = await axios.get(
          `http://localhost:8080/permissao/telas/${id}`,
          getRequestConfig()
        );

        const permissoesObj = {};
        permissoesUsuario.data.forEach((telaPermissao) => {
          permissoesObj[telaPermissao.tela] = {
            adicionar: telaPermissao.permissoes.includes("POST"),
            editar: telaPermissao.permissoes.includes("PUT"),
            excluir: telaPermissao.permissoes.includes("DELETE"),
            visualizar: telaPermissao.permissoes.includes("GET"),
          };
        });

        const telasResponse = await axios.get("http://localhost:8080/tela", getRequestConfig());
        const todasAsTelas = telasResponse.data;
        setTelas(todasAsTelas);

        todasAsTelas.forEach((tela) => {
          if (!permissoesObj[tela.nomeTela]) {
            permissoesObj[tela.nomeTela] = {
              adicionar: false,
              editar: false,
              excluir: false,
              visualizar: false,
            };
          }
        });

        setPermissoes(permissoesObj);
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
        setMessageType("error");
        setMessage("Erro ao carregar dados do usuário!");

      }
    };

    fetchUserData();
  }, [id, navigate]);

  const toggleAllCheckboxes = (checked) => {
    const novasPermissoes = {};
    telas.forEach((tela) => {
      if (tela.nomeTela === "Tela de Tela") return;
      novasPermissoes[tela.nomeTela] = {
        adicionar: checked,
        editar: checked,
        excluir: checked,
        visualizar: checked,
      };
    });
    setPermissoes(novasPermissoes);
  };

  const handleAdminCheckboxChange = () => {
    const novoValor = !adminChecked;
    setAdminChecked(novoValor);

    if (novoValor) {
      const novasPermissoes = {};
      telas.forEach((tela) => {
        if (tela.nomeTela === "Tela de Tela") return;
        novasPermissoes[tela.nomeTela] = {
          adicionar: true,
          editar: true,
          excluir: true,
          visualizar: true,
        };
      });
      setPermissoes(novasPermissoes);
    } else {
      toggleAllCheckboxes(false);
    }
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

    if (!nome || !email || !telefone || !login) {
      setMessageType("error");
      setMessage("Preencha todos os campos!");

      return;
    }

    const token = getToken();
    if (!token) return;

    try {
      const updateResponse = await axios.put(
        `http://localhost:8080/usuario/${id}`,
        {
          nomeUsuario: nome,
          emailUsuario: email,
          senhaUsuario: senha || undefined,
          telefoneUsuario: telefone,
          login,
          isAdm: adminChecked,
        },
        getRequestConfig()
      );

      if (updateResponse.status === 200) {

        await axios.delete(`http://localhost:8080/usuario/tela/${id}`, getRequestConfig());

        const usuarioId = updateResponse.data.idUsuario;
        const permissaoRequests = [];


        for (const [nomeTela, permissoesTela] of Object.entries(permissoes)) {
          const telaId = telas.find((t) => t.nomeTela === nomeTela)?.idTela;
          if (!telaId) continue;

          for (const [acao, ativa] of Object.entries(permissoesTela)) {
            if (ativa) {
              permissaoRequests.push(
                axios.post(
                  `http://localhost:8080/usuario/${usuarioId}/permissao`,
                  null,
                  {
                    params: {
                      idTela: telaId,
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

        await Promise.all(permissaoRequests);
        setMessageType("success");
        setMessage("Usuário atualizado com sucesso!");
        setTimeout(() => navigate("/usuarios"), 2000);
      }
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      setMessageType("error");
      setMessage("Erro ao atualizar uruário!");
      setTimeout(() => navigate("/usuarios"), 2000);

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
      <C.Title>Editar Usuário</C.Title>

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
              onChange={(e) => {
                const onlyNums = e.target.value.replace(/\D/g, "");
                setTelefone(onlyNums);
              }}

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
              placeholder="Nova senha"
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

        {message && <C.Message type={messageType}>{message}</C.Message>}

        <C.AddButtonWrapper>
          <Button Text="Salvar Alterações" onClick={handleSubmit} />
        </C.AddButtonWrapper>
      </C.Form>
    </C.Container>
  );
};

export default EditUsuario;
