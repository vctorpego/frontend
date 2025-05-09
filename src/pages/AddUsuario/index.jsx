import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import * as C from "./styles";

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
        // Buscar telas dinâmicas
        const telaResponse = await axios.get("http://localhost:8080/tela", getRequestConfig());
        const telasBackend = telaResponse.data;
        setTelas(telasBackend);

        // Inicializar permissões para todas as telas
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

        // Buscar permissões do usuário atual
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

        // Definir o valor do checkbox "Administrador"
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
    toggleAllCheckboxes(novoValor); // Marca ou desmarca todos os checkboxes
  };

  const handleCheckboxChange = (telaNome, acao) => {
    setPermissoes((prevPermissoes) => ({
      ...prevPermissoes,
      [telaNome]: {
        ...prevPermissoes[telaNome],
        [acao]: !prevPermissoes[telaNome]?.[acao],
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome || !email || !senha || !telefone || !login) {
      alert("Preencha todos os campos.");
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
        alert("Usuário adicionado com sucesso!");
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
      if (error.response?.status === 409) {
        alert("Usuário já cadastrado.");
      } else {
        alert("Erro ao adicionar usuário.");
      }
    }
  };

  if (!hasPermission) {
    return <div>Você não tem permissão para acessar esta página.</div>;
  }

  return (
    <C.Container>
      <C.Title>Adicionar Usuário</C.Title>
      <C.Form onSubmit={handleSubmit}>
        <C.Input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <C.Input
          type="text"
          placeholder="Telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />
        <C.Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <C.Input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <C.Input
          type="text"
          placeholder="Login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />

        {isSuperAdm && (
          <C.CheckboxContainer>
            <label>
              <input
                type="checkbox"
                checked={adminChecked}
                onChange={handleAdminCheckboxChange}
              />
              Administrador
            </label>
          </C.CheckboxContainer>
        )}


        {telas
          .filter((tela) => tela.nomeTela !== "Tela de Tela") // Oculta a "Tela de Tela"
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

        <C.Button type="submit">Adicionar Usuário</C.Button>
      </C.Form>
    </C.Container>
  );
};

export default AddUsuario;
