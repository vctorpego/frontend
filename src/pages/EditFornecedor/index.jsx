import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { Container, Title, Form, Input, Button, Label } from "./styles";

const EditFornecedor = () => {
  const { idFornecedor } = useParams(); // Alterado para 'idFornecedor'
  const [cnpjFornecedor, setCnpjFornecedor] = useState("");
  const [nomeSocialFornecedor, setNomeSocialFornecedor] = useState("");
  const [celularFornecedor, setCelularFornecedor] = useState("");
  const [emailFornecedor, setEmailFornecedor] = useState("");
  const [chavePixFornecedor, setChavePixFornecedor] = useState("");
  const [hasPermission, setHasPermission] = useState(false);  // Verificação de permissão
  const navigate = useNavigate();

  useEffect(() => {
    const verificarPermissao = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Você precisa estar logado!");
        navigate("/auth/login");
        return;
      }

      const decoded = jwtDecode(token);
      const userLogin = decoded.sub; // Extraindo ID do usuário do token

      const getRequestConfig = () => ({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      try {
        // Requisição para buscar as permissões do usuário
        const response = await axios.get(
          `http://localhost:8080/usuario/id/${userLogin}`,
          getRequestConfig()
        );
        const userId = response.data;

        const permissionsResponse = await axios.get(
          `http://localhost:8080/permissao/telas/${userId}`,
          getRequestConfig()
        );

        // Verifica se o usuário tem permissão para "PUT" na tela de "Tela de Fornecedores"
        const permissoesTela = permissionsResponse.data.find(
          (perm) => perm.tela === "Tela de Fornecedores"
        );

        const permissoes = permissoesTela?.permissoes || [];
        const hasPutPermission = permissoes.includes("PUT");

        setHasPermission(hasPutPermission);

        // Caso não tenha permissão, redireciona para página de acesso negado
        if (!hasPutPermission) {
          navigate("/nao-autorizado");
        }
      } catch (error) {
        console.error("Erro ao verificar permissões:", error);
        navigate("/nao-autorizado");
      }
    };

    verificarPermissao();
  }, [navigate]);

  useEffect(() => {
    const fetchFornecedor = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Você precisa estar logado!");
        navigate("/auth/login");
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp < Date.now() / 1000) {
          alert("Token expirado. Faça login novamente.");
          localStorage.removeItem("token");
          navigate("/auth/login");
          return;
        }

        const response = await axios.get(`http://localhost:8080/fornecedor/${idFornecedor}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { cnpjFornecedor, nomeSocialFornecedor, celularFornecedor, emailFornecedor, chavePixFornecedor } = response.data;
        setCnpjFornecedor(cnpjFornecedor);
        setNomeSocialFornecedor(nomeSocialFornecedor);
        setCelularFornecedor(celularFornecedor);
        setEmailFornecedor(emailFornecedor);
        setChavePixFornecedor(chavePixFornecedor);
      } catch (error) {
        console.error("Erro ao buscar o fornecedor:", error);
        alert("Erro ao carregar o fornecedor.");
      }
    };
    fetchFornecedor();
  }, [idFornecedor, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cnpjFornecedor || !nomeSocialFornecedor || !celularFornecedor || !emailFornecedor || !chavePixFornecedor) {
      alert("Por favor, preencha todos os campos.");
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
      if (decodedToken.exp < Date.now() / 1000) {
        alert("Token expirado. Faça login novamente.");
        localStorage.removeItem("token");
        navigate("/auth/login");
        return;
      }

      await axios.put(
        `http://localhost:8080/fornecedor/alterar/${idFornecedor}`,
        {
          cnpjFornecedor,
          nomeSocialFornecedor,
          celularFornecedor,
          emailFornecedor,
          chavePixFornecedor,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Fornecedor atualizado com sucesso!");
      navigate("/fornecedores");
    } catch (error) {
      console.error("Erro ao atualizar o fornecedor:", error);
      alert("Erro ao atualizar o fornecedor.");
    }
  };

  // Exibe a tela de edição apenas se o usuário tiver permissão
  if (!hasPermission) {
    return <p>Você não tem permissão para editar fornecedores.</p>;
  }

  return (
    <Container>
      <Title>Editar Fornecedor</Title>
      <Form onSubmit={handleSubmit}>
        <div>
          <Label>CNPJ do Fornecedor:</Label>
          <Input
            type="text"
            value={cnpjFornecedor}
            onChange={(e) => setCnpjFornecedor(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Nome Social:</Label>
          <Input
            type="text"
            value={nomeSocialFornecedor}
            onChange={(e) => setNomeSocialFornecedor(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Celular:</Label>
          <Input
            type="text"
            value={celularFornecedor}
            onChange={(e) => setCelularFornecedor(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Email:</Label>
          <Input
            type="email"
            value={emailFornecedor}
            onChange={(e) => setEmailFornecedor(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Chave Pix:</Label>
          <Input
            type="text"
            value={chavePixFornecedor}
            onChange={(e) => setChavePixFornecedor(e.target.value)}
            required
          />
        </div>
        <Button type="submit">Atualizar Fornecedor</Button>
      </Form>
    </Container>
  );
};

export default EditFornecedor;
