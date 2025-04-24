import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate, useParams } from "react-router-dom";
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

const EditUsuario = () => {
  const { id } = useParams();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
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
        const response = await axios.get(
          `http://localhost:8080/usuario/id/${userLogin}`,
          getRequestConfig()
        );
        const userId = response.data;

        const permissionsResponse = await axios.get(
          `http://localhost:8080/permissao/telas/${userId}`,
          getRequestConfig()
        );

        const permissoesTela = permissionsResponse.data.find(
          (perm) => perm.tela === "Tela Usuarios"
        );

        const permissoes = permissoesTela?.permissoes || [];
        const hasEditPermission = permissoes.includes("PUT");
        setHasPermission(hasEditPermission);

        if (!hasEditPermission) {
          navigate("/nao-autorizado");
        }

        const userToEditResponse = await axios.get(
          `http://localhost:8080/usuario/${id}`,
          getRequestConfig()
        );
        const { nomeUsuario, emailUsuario, telefoneUsuario, login } = userToEditResponse.data;
        setNome(nomeUsuario);
        setEmail(emailUsuario);
        setTelefone(telefoneUsuario);
        setLogin(login);

        const userPermissionsResponse = await axios.get(
          `http://localhost:8080/permissao/telas/${id}`,
          getRequestConfig()
        );

        const permissoesUsuario = userPermissionsResponse.data;

        setPermissoes((prev) => {
          return telas.reduce((acc, tela) => {
            const permissoesDaTela = permissoesUsuario.find((perm) => perm.tela === tela.nome);
            if (permissoesDaTela) {
              acc[tela.nome] = {
                adicionar: permissoesDaTela.permissoes.includes("POST"),
                editar: permissoesDaTela.permissoes.includes("PUT"),
                excluir: permissoesDaTela.permissoes.includes("DELETE"),
                visualizar: permissoesDaTela.permissoes.includes("GET"),
              };
            } else {
              acc[tela.nome] = {
                adicionar: false,
                editar: false,
                excluir: false,
                visualizar: false,
              };
            }
            return acc;
          }, {});
        });
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

    if (!nome || !email || !telefone || !login) {
      alert("Preencha todos os campos.");
      return;
    }

    const token = getToken();

    if (!token) {
      alert("Você precisa estar logado!");
      navigate("/auth/login");
      return;
    }

    // Gerar a lista de permissões a partir dos checkboxes selecionados
    const permissoesAtivas = [];

    telas.forEach((tela) => {
      Object.keys(acoes).forEach((acao) => {
        if (permissoes[tela.nome][acao]) {
          permissoesAtivas.push({
            idTela: tela.id,
            idPermissao: acoes[acao],
          });
        }
      });
    });

    try {
      // Enviar o PUT para atualizar o usuário
      const response = await axios.put(
        `http://localhost:8080/usuario/${id}`,
        {
          nomeUsuario: nome,
          emailUsuario: email,
          telefoneUsuario: telefone,
          login: login,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        await axios.delete(
          `http://localhost:8080/usuario/tela/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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

        // Esperar todas as permissões serem adicionadas
        await Promise.all(permissaoPromises);

        alert("Usuário e permissões atualizados com sucesso!");
        setTimeout(() => {
          navigate("/usuarios");
        }, 1500);
      }else if (response.status === 409){
        console.log("USUARIO NAO PODE SE EDITAR");
        return;

      }
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
    }
  };

  if (!hasPermission) {
    return <div>Você não tem permissão para acessar esta página.</div>;
  }

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

          <C.InputWrapper>
            <C.Label>Login:</C.Label>
            <C.Input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Ex: jao"
              required
              disabled
              readOnly
            />
          </C.InputWrapper>
        </C.InputGroup>

        <div>
          <C.Label>Permissões:</C.Label>
          <C.PermissoesContainer>
            {telas.map((tela) => (
              <div key={tela.id}>
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
              </div>
            ))}
          </C.PermissoesContainer>
        </div>

        <C.Button type="submit">Salvar Alterações</C.Button>
      </C.Form>
    </C.Container>
  );
};

export default EditUsuario;
