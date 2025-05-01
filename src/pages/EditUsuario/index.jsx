import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate, useParams } from "react-router-dom";
import * as C from "./styles";

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
  const [telefone, setTelefone] = useState("");
  const [login, setLogin] = useState("");
  const [permissoes, setPermissoes] = useState({});
  const [telas, setTelas] = useState([]);
  const [hasPermission, setHasPermission] = useState(false);
  const navigate = useNavigate();

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

        const telaUsuarios = permissionsResponse.data.find(
          (perm) => perm.tela === "Tela de Usuarios"
        );

        const temPermissaoPUT = telaUsuarios?.permissoes?.includes("PUT") || false;
        setHasPermission(temPermissaoPUT);

        if (!temPermissaoPUT) {
          navigate("/nao-autorizado");
          return;
        }

        // Dados do usuário sendo editado
        const userToEditResponse = await axios.get(
          `http://localhost:8080/usuario/${id}`,
          getRequestConfig()
        );

        const { nomeUsuario, emailUsuario, telefoneUsuario, login } = userToEditResponse.data;
        setNome(nomeUsuario);
        setEmail(emailUsuario);
        setTelefone(telefoneUsuario);
        setLogin(login);

        // Permissões atuais do usuário
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

        // Carregar todas as telas do sistema
        const telasResponse = await axios.get("http://localhost:8080/tela", getRequestConfig());
        const todasAsTelas = telasResponse.data;
        setTelas(todasAsTelas);

        // Garante que todas as telas tenham um objeto no estado de permissões
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
        [acao]: !prev[tela]?.[acao],
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome || !email || !telefone || !login) {
      alert("Preencha todos os campos.");
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
          telefoneUsuario: telefone,
          login,
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
        navigate("/usuarios");
      }
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      alert("Erro ao atualizar usuário.");
    }
  };

  if (!hasPermission) {
    return <div>Você não tem permissão para acessar esta página.</div>;
  }

  return (
    <C.Container>
      <C.Title>Editar Usuário</C.Title>
      <C.Form onSubmit={handleSubmit}>
        <C.Input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        <C.Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <C.Input type="text" placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
        <C.Input type="text" placeholder="Login" value={login} onChange={(e) => setLogin(e.target.value)} />

        {telas
          .filter((tela) => tela.nomeTela !== "Tela de Tela")
          .map((tela) => (
            <C.CheckboxContainer key={tela.idTela}>
              <strong>{tela.nomeTela}</strong>
              {Object.keys(acoes).map((acao) => (
                <label key={acao}>
                  <input
                    type="checkbox"
                    checked={permissoes[tela.nomeTela]?.[acao] || false}
                    onChange={() => handleCheckboxChange(tela.nomeTela, acao)}
                  />
                  {acao}
                </label>
              ))}
            </C.CheckboxContainer>
          ))}

        <C.Button type="submit">Salvar Alterações</C.Button>
      </C.Form>
    </C.Container>
  );
};

export default EditUsuario;
