import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import * as C from "./styles"; // Importando os estilos de 'styles.jsx'

const telas = [
  { nome: "Tela de Dashboard", id: 1 },
  { nome: "Tela de Produtos", id: 2 },
  { nome: "Tela de Fornecedores", id: 3 },
  { nome: "Tela de Clientes", id: 4 },
  { nome: "Tela de Recarga", id: 5 },
  { nome: "Tela de Vendas", id: 6 },
  { nome: "Tela de Pagamentos", id: 7 },
  { nome: "Tela de Relatórios", id: 8 },
  { nome: "Tela de Entrada", id: 9 },
  { nome: "Tela de Saída", id: 10 },
  { nome: "Tela Usuarios", id: 11 },
];

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
  const [userPermissions, setUserPermissions] = useState([]);
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
  
    const fetchUserPermissions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/usuario/id/${userLogin}`,
          getRequestConfig()
        );
        const userId = response.data;
  
        const permissionsResponse = await axios.get(
          `http://localhost:8080/permissao/telas/${userId}`,
          getRequestConfig()
        );
        setUserPermissions(permissionsResponse.data);
  
        const permissoesTela = permissionsResponse.data.find(
          (perm) => perm.tela === "Tela Usuarios"
        );
  
        const permissoes = permissoesTela?.permissoes || [];
        setPermissoes((prev) => {
          return telas.reduce((acc, tela) => {
            acc[tela.nome] = {
              adicionar: false,
              editar: false,
              excluir: false,
              visualizar: false,
            };
            return acc;
          }, {});
        });

        const hasPostPermission = permissoes.includes("POST");
        setHasPermission(hasPostPermission);

        // Redirecionar para /nao-autorizado se o usuário não tiver permissão
        if (!hasPostPermission) {
          navigate("/nao-autorizado");
        }
      } catch (error) {
        console.error("Erro ao buscar permissões:", error);
      }
    };
  
    fetchUserPermissions();
  }, [navigate]);

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

    const token = getToken();

    if (!token) {
      alert("Você precisa estar logado!");
      navigate("/auth/login");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/usuario",
        {
          emailUsuario: email,
          telefoneUsuario: telefone,
          nomeUsuario: nome,
          login: login,
          senhaUsuario: senha,
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
          for (const acao in acoes) {
            if (permissoes[tela.nome][acao]) {
              permissaoPromises.push(
                axios.post(
                  `http://localhost:8080/usuario/${usuarioId}/permissao`,
                  null,
                  {
                    params: {
                      idTela: tela.id,
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
          placeholder="Telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />
        <C.Input
          type="text"
          placeholder="Login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
        {/* Exibição das permissões */}
        {telas.map((tela) => (
          <C.CheckboxContainer key={tela.id}>
            <strong>{tela.nome}</strong>
            {Object.keys(acoes).map((acao) => (
              <label key={acao}>
                <input
                  type="checkbox"
                  checked={permissoes[tela.nome][acao]}
                  onChange={() => handleCheckboxChange(tela.nome, acao)}
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
