import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { Container, Title, Form, Input, Button, Label } from "../AddCliente/styles";

const EditProduto = () => {
  const { idProduto } = useParams();  // Altere para 'idProduto'
  const [nomeProduto, setNomeProduto] = useState("");
  const [precoCusto, setPrecoCusto] = useState("");
  const [precoVenda, setPrecoVenda] = useState("");
  const [estoque, setEstoque] = useState("");
  const [codigoBarrasProduto, setCodigoBarrasProduto] = useState("");  // Alterado para 'codigoBarrasProduto'
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduto = async () => {
      const token = localStorage.getItem("token");
      
      // Verifica se o token existe
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
        alert("Erro ao carregar o produto.");
      }
    };
    fetchProduto();
  }, [idProduto, navigate]);

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
        `http://localhost:8080/produto/${idProduto}`,
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

      alert("Produto atualizado com sucesso!");
      navigate("/produtos");
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
