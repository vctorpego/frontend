import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { Container, Title, Form, Input, Button, Label, Message } from "../EditProduto/styles";

const EditProduto = () => {
  const { idProduto } = useParams();  // Altere para 'idProduto'
  const [nomeProduto, setNomeProduto] = useState("");
  const [precoCusto, setPrecoCusto] = useState("");
  const [precoVenda, setPrecoVenda] = useState("");
  const [estoque, setEstoque] = useState("");
  const [codigoBarrasProduto, setCodigoBarrasProduto] = useState("");  // Alterado para 'codigoBarrasProduto'
  const [hasPermission, setHasPermission] = useState(false);  // Estado para verificar permissão
  const navigate = useNavigate();
  const [messageType, setMessageType] = useState(""); // tipo da mensagem: error, success, info
  const [message, setMessage] = useState("");


  useEffect(() => {
    const verificarPermissao = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/auth/login");
        return;
      }

      const decoded = jwtDecode(token);
      const userLogin = decoded.sub; // Extrai o ID do usuário do token

      const getRequestConfig = () => ({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      try {
        // Faz a requisição para pegar os dados do usuário
        const response = await axios.get(
          `http://localhost:8080/usuario/id/${userLogin}`,
          getRequestConfig()
        );
        const userId = response.data;

        // Requisição para pegar as permissões do usuário
        const permissionsResponse = await axios.get(
          `http://localhost:8080/permissao/telas/${userId}`,
          getRequestConfig()
        );

        // Verifica se o usuário tem permissão para "PUT" na tela de "Tela de Produtos"
        const permissoesTela = permissionsResponse.data.find(
          (perm) => perm.tela === "Tela de Produtos" // Alterado para "Tela de Produtos"
        );

        const permissoes = permissoesTela?.permissoes || [];
        const hasPutPermission = permissoes.includes("PUT");

        setHasPermission(hasPutPermission);

        // Caso não tenha permissão de PUT, redireciona para uma página de acesso negado
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
    const fetchProduto = async () => {
      const token = localStorage.getItem("token");

      // Verifica se o token existe
      if (!token) {
        setMessageType("error");
        setMessage("Voce precisa estar logado!");
        setTimeout(() => navigate("/auth/login"), 2000);
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp < Date.now() / 1000) {
          setMessageType("error");
          setMessage("Token Expirado!");
          localStorage.removeItem("token");
          setTimeout(() => navigate("/auth/login"), 2000);

          return;
        }

        // Envia o token no cabeçalho da requisição
        const response = await axios.get(`http://localhost:8080/produto/${idProduto}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { nomeProduto, precoProduto, valorDeCustoProduto, quantProduto, codigoBarrasProduto } = response.data;
        setNomeProduto(nomeProduto);
        setPrecoCusto(valorDeCustoProduto);
        setPrecoVenda(precoProduto);
        setEstoque(quantProduto);
        setCodigoBarrasProduto(codigoBarrasProduto);  // Carrega o código de barras

      } catch (error) {
        console.error("Erro ao buscar o produto:", error);
        setMessageType("error");
        setMessage("Erro ao carregar Produto!");

      }
    };
    fetchProduto();
  }, [idProduto, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hasPermission) {
      setMessageType("error");
      setMessage("Voce não tem permissao para editar produtos!");
      return;
    }

    if (!nomeProduto || !precoCusto || !precoVenda || !estoque) {
      setMessageType("info");
      setMessage("Preencha todos os campos!");

      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setMessageType("error");
      setMessage("Voce precisa estar logado!");
      setTimeout(() => navigate("/auth/login"), 2000);
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp < Date.now() / 1000) {
        setMessageType("error");
        setMessage("Token Expirado!");
        setTimeout(() => navigate("/auth/login"), 2000);
        return;
      }

      await axios.put(
        `http://localhost:8080/produto/alterar/${idProduto}`,
        {
          nomeProduto,  // Não envia nomeProduto para ser alterado
          precoProduto: precoVenda,
          valorDeCustoProduto: precoCusto,
          quantProduto: estoque,
          codigoBarrasProduto: codigoBarrasProduto,  // Inclui o código de barras no corpo da requisição
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessageType("success");
      setMessage("Produto atualizado com sucesso!!");
      setTimeout(() => navigate("/produtos"), 2000);
    } catch (error) {
      console.error("Erro ao atualizar o produto:", error);
      setMessageType("error");
      setMessage("Erro ao atualizar o produto!");

    }
  };

  // Se o usuário não tem permissão para editar, exibe mensagem de acesso negado
  if (!hasPermission) {
    return <p>Você não tem permissão para editar produtos.</p>;
  }

  return (
    <Container>
      <Title>Editar Produto</Title>
      {message && <Message type={messageType}>{message}</Message>}
      <Form onSubmit={handleSubmit}>
        <div>
          <Label>Nome do Produto:</Label>
          <Input
            type="text"
            value={nomeProduto}
            readOnly // Torna o campo não editável
          />
        </div>
        <div>
          <Label>Preço de Custo:</Label>
          <Input
            type="number"
            value={precoCusto}
            onChange={(e) => setPrecoCusto(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Preço de Venda:</Label>
          <Input
            type="number"
            value={precoVenda}
            onChange={(e) => setPrecoVenda(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Estoque:</Label>
          <Input
            type="number"
            value={estoque}
            onChange={(e) => setEstoque(e.target.value)}
            required
          />
        </div>
        {/* O código de barras pode ser deixado oculto ou não editável */}
        <div>
          <Label>Código de Barras:</Label>
          <Input
            type="text"
            value={codigoBarrasProduto}
            readOnly // Não editável 
          />
        </div>
        <Button type="submit">Atualizar Produto</Button>
      </Form>
    </Container>
  );
};

export default EditProduto;
