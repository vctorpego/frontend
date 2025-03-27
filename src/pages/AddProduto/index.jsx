import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode"; // Importa a biblioteca para decodificar o token
import { Container, Title, Form, Input, Button, Label } from '../AddCliente/styles';  

const AddProduto = () => {
  const [nomeProduto, setNomeProduto] = useState("");
  const [precoCusto, setPrecoCusto] = useState("");
  const [precoVenda, setPrecoVenda] = useState("");
  const [estoque, setEstoque] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Formulário enviado");

    if (!nomeProduto || !precoCusto || !precoVenda || !estoque) {
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
      // Decodifica o token para verificar a expiração
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Tempo atual em segundos

      if (decodedToken.exp < currentTime) {
        alert("Token expirado. Faça login novamente.");
        localStorage.removeItem("token");
        navigate("/auth/login");
        return;
      }

      const response = await axios.post(
        "http://localhost:8080/produto",
        {
          nomeProduto,
          precoProduto: precoVenda,
          valorDeCustoProduto: precoCusto,
          quantProduto: estoque,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Produto adicionado com sucesso!");
        setTimeout(() => {
          navigate("/produtos");
        }, 1500);
      }
    } catch (error) {
      console.error("Erro ao adicionar o produto:", error);

      if (error.response) {
        if (error.response.status === 409) {
          alert("Erro: O Produto já está cadastrado no sistema.");
        } else if (error.response.status === 401) {
          alert("Token inválido ou expirado. Faça login novamente.");
          localStorage.removeItem("token");
          navigate("/auth/login");
        } else if (error.response.status === 500) {
          alert("Erro interno do servidor. Tente novamente mais tarde.");
        } else {
          alert("Erro ao adicionar o produto: " + error.response.data);
        }
      } else {
        alert("Erro ao se comunicar com o servidor.");
      }
    }
  };

  return (
    <Container>
      <Title>Adicionar Produto</Title>
      <Form onSubmit={handleSubmit}>
        <div>
          <Label>Nome do Produto:</Label>
          <Input
            type="text"
            value={nomeProduto}
            onChange={(e) => setNomeProduto(e.target.value)}
            placeholder="Nome do Produto"
            required
          />
        </div>
        <div>
          <Label>Preço de Custo:</Label>
          <Input
            type="number"
            value={precoCusto}
            onChange={(e) => setPrecoCusto(e.target.value)}
            placeholder="Preço de Custo"
            required
          />
        </div>
        <div>
          <Label>Preço de Venda:</Label>
          <Input
            type="number"
            value={precoVenda}
            onChange={(e) => setPrecoVenda(e.target.value)}
            placeholder="Preço de Venda"
            required
          />
        </div>
        <div>
          <Label>Estoque:</Label>
          <Input
            type="number"
            value={estoque}
            onChange={(e) => setEstoque(e.target.value)}
            placeholder="Quantidade em Estoque"
            required
          />
        </div>
        <Button type="submit">Adicionar Produto</Button>
      </Form>
    </Container>
  );
};

export default AddProduto;
