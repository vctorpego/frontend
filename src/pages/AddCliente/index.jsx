import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Title, Form, Input, Button, Label } from '../AddProduto/styles';  // Importando os estilos

const AddCliente = () => {
  const [nomeCliente, setNomeCliente] = useState("");  // Nome do cliente
  const [saldoCliente, setSaldoCliente] = useState("");  // Saldo do cliente
  const [limiteCliente, setLimiteCliente] = useState("");  // Limite de crédito
  const [dtNascCliente, setDtNascCliente] = useState("");  // Data de nascimento
  const [faturaCliente, setFaturaCliente] = useState("");  // Fatura do cliente
  const navigate = useNavigate();

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Formulário enviado");

    // Verifica se todos os campos foram preenchidos
    if (!nomeCliente || !saldoCliente || !limiteCliente || !dtNascCliente || !faturaCliente) {
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
      // Requisição para adicionar o cliente com o token no cabeçalho
      const response = await axios.post(
        "http://localhost:8080/cliente", 
        { 
          nomeCliente, 
          saldoCliente: parseFloat(saldoCliente),  // Garantir que seja um número
          limiteCliente: parseFloat(limiteCliente),  // Garantir que seja um número
          dtNascCliente,  // Data de nascimento
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Adicionando o token no cabeçalho
          },
        }
      );

      // Se a criação foi bem-sucedida, mostra o alerta e redireciona para a lista de clientes
      if (response.status === 200) {
        alert("Cliente adicionado com sucesso!");
        // Redireciona para a rota de clientes após o alerta
        setTimeout(() => {
          navigate("/cliente"); // Redireciona para a rota de clientes após o alerta
        }, 1500);  // Delay de 1.5 segundos para mostrar o alerta antes do redirecionamento
      }
    } catch (error) {
      console.error("Erro ao adicionar o cliente:", error);

      if (error.response) {
        // Verifica se o erro é devido ao cliente já existir
        if (error.response.status === 409) {
          alert("Erro: O Cliente já está cadastrado no sistema.");
        } else if (error.response.status === 401) {
          // Se o erro for 401 (token inválido ou expirado)
          alert("Token inválido ou expirado. Por favor, faça login novamente.");
          localStorage.removeItem("token");  // Remove o token inválido do localStorage
          navigate("auth/login");  // Redireciona para a página de login
        } else if (error.response.status === 500) {
          alert("Erro interno do servidor. Tente novamente mais tarde.");
        } else {
          alert("Erro ao adicionar o cliente: " + error.response.data);
        }
      } else {
        alert("Erro ao se comunicar com o servidor.");
      }
    }
  };

  return (
    <Container>
      <Title>Adicionar Cliente</Title>
      <Form onSubmit={handleSubmit}>
        <div>
          <Label>Nome do Cliente:</Label>
          <Input
            type="text"
            value={nomeCliente}
            onChange={(e) => setNomeCliente(e.target.value)} // Atualizando o valor do estado
            placeholder="Nome do Cliente"
            required
          />
        </div>
        <div>
          <Label>Saldo do Cliente:</Label>
          <Input
            type="number"
            value={saldoCliente}
            onChange={(e) => setSaldoCliente(e.target.value)}
            placeholder="Saldo do Cliente"
            required
          />
        </div>
        <div>
          <Label>Limite de Crédito:</Label>
          <Input
            type="number"
            value={limiteCliente}
            onChange={(e) => setLimiteCliente(e.target.value)}
            placeholder="Limite de Crédito"
            required
          />
        </div>
        <div>
          <Label>Data de Nascimento:</Label>
          <Input
            type="date"
            value={dtNascCliente}
            onChange={(e) => setDtNascCliente(e.target.value)}
            placeholder="Data de Nascimento"
            required
          />
        </div>

        <Button type="submit">Adicionar Cliente</Button>
      </Form>
    </Container>
  );
};

export default AddCliente;
