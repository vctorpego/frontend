import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Title, Form, Input, Button, Label } from './styles';  // Importando os estilos

const AddProduto = () => {
  const [nomeProduto, setNomeProduto] = useState("");  // Nome do produto
  const [precoCusto, setPrecoCusto] = useState("");  // Preço de custo
  const [precoVenda, setPrecoVenda] = useState("");  // Preço de venda
  const [estoque, setEstoque] = useState("");  // Quantidade em estoque
  const navigate = useNavigate();

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Formulário enviado");

    // Verifica se todos os campos foram preenchidos
    if (!nomeProduto || !precoCusto || !precoVenda || !estoque) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    // Obtendo o token do localStorage
    const token = localStorage.getItem("token");


    if (!token) {
      alert("Você precisa estar logado!");
      navigate("auth/login"); // Redireciona para a página de login
      return;
    }

    try {

      // Requisição para adicionar o produto com o token no cabeçalho
      const response = await axios.post(
        "http://localhost:8080/produto", 
        { 
          nomeProduto, 
          precoProduto: precoVenda,  // Renomeei para corresponder ao JSON
          valorDeCustoProduto: precoCusto,  // Renomeei para corresponder ao JSON
          quantProduto: estoque,  // Renomeei para corresponder ao JSON
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Adicionando o token no cabeçalho
          },
        }
      );



      // Se a criação foi bem-sucedida, mostra o alerta e redireciona para a lista de produtos
      if (response.status === 200) {
        alert("Produto adicionado com sucesso!"); 
        // Redireciona para a rota de produtos após o alerta
        setTimeout(() => {
          navigate("/produto"); // Redireciona para a rota de produtos após o alerta
        }, 1500);  // Delay de 1.5 segundos para mostrar o alerta antes do redirecionamento
      }
    } catch (error) {
      console.error("Erro ao adicionar o produto:", error);

      if (error.response) {
        // Verifica se o erro é devido ao produto já existir
        if (error.response.status === 409) {
          alert("Erro: O Produto já está cadastrado no sistema.");
        } else if (error.response.status === 401) {
          // Se o erro for 401 (token inválido ou expirado)
          alert("Token inválido ou expirado. Por favor, faça login novamente.");
          localStorage.removeItem("token");  // Remove o token inválido do localStorage
          navigate("auth/login");  // Redireciona para a página de login
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
            onChange={(e) => setNomeProduto(e.target.value)} // Atualizando o valor do estado
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
