import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import jwtDecode from "jwt-decode"; // Importa a biblioteca para decodificar o token
import { Container, Title, Form, Input, Button, Label } from "../AddCliente/styles";

const EditProduto = () => {
  const { id } = useParams();
  const [nomeProduto, setNomeProduto] = useState("");
  const [precoCusto, setPrecoCusto] = useState("");
  const [precoVenda, setPrecoVenda] = useState("");
  const [estoque, setEstoque] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/produto/${id}`);
        const { nomeProduto, precoProduto, valorDeCustoProduto, quantProduto } = response.data;
        setNomeProduto(nomeProduto);
        setPrecoCusto(valorDeCustoProduto);
        setPrecoVenda(precoProduto);
        setEstoque(quantProduto);
      } catch (error) {
        console.error("Erro ao buscar o produto:", error);
        alert("Erro ao carregar o produto.");
      }
    };
    fetchProduto();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp < Date.now() / 1000) {
        alert("Token expirado. Faça login novamente.");
        localStorage.removeItem("token");
        navigate("/auth/login");
        return;
      }

      await axios.put(
        `http://localhost:8080/produto/${id}`,
        {
          nomeProduto,
          precoProduto: precoVenda,
          valorDeCustoProduto: precoCusto,
          quantProduto: estoque,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Produto atualizado com sucesso!");
      navigate("/produto");
    } catch (error) {
      console.error("Erro ao atualizar o produto:", error);
      alert("Erro ao atualizar o produto.");
    }
  };

  return (
    <Container>
      <Title>Editar Produto</Title>
      <Form onSubmit={handleSubmit}>
        <div>
          <Label>Nome do Produto:</Label>
          <Input type="text" value={nomeProduto} onChange={(e) => setNomeProduto(e.target.value)} required />
        </div>
        <div>
          <Label>Preço de Custo:</Label>
          <Input type="number" value={precoCusto} onChange={(e) => setPrecoCusto(e.target.value)} required />
        </div>
        <div>
          <Label>Preço de Venda:</Label>
          <Input type="number" value={precoVenda} onChange={(e) => setPrecoVenda(e.target.value)} required />
        </div>
        <div>
          <Label>Estoque:</Label>
          <Input type="number" value={estoque} onChange={(e) => setEstoque(e.target.value)} required />
        </div>
        <Button type="submit">Atualizar Produto</Button>
      </Form>
    </Container>
  );
};

export default EditProduto;