import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Title, Form, Input, Button, Label } from '../AddProduto/styles';
import useCardScanner from "../../hooks/useCardScanner"; // Importa o hook do cartão

const AddCliente = () => {
  const [nomeCliente, setNomeCliente] = useState("");
  const [saldoCliente, setSaldoCliente] = useState("");
  const [limiteCliente, setLimiteCliente] = useState("");
  const [dtNascCliente, setDtNascCliente] = useState("");
  const [faturaCliente, setFaturaCliente] = useState(""); // Novo estado para faturaCliente
  const [codigoCartao, setCodigoCartao] = useState(""); // Novo estado para o cartão

  const navigate = useNavigate();

  // Ativa o leitor de cartão
  useCardScanner((codigoLido) => {
    // Atualiza apenas o estado do código do cartão quando o cartão for lido
    setCodigoCartao(codigoLido);
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nomeCliente || !saldoCliente || !limiteCliente || !dtNascCliente || !faturaCliente || !codigoCartao) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Você precisa estar logado!");
      navigate("auth/login");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/cliente", 
        { 
          nomeCliente, 
          saldoCliente: parseFloat(saldoCliente),
          limiteCliente: parseFloat(limiteCliente),
          dtNascCliente,
          faturaCliente: parseFloat(faturaCliente), // Inclui o campo faturaCliente
          idCartaoCliente: codigoCartao // Inclui o campo idCartaoCliente
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Cliente adicionado com sucesso!");
        setTimeout(() => {
          navigate("/clientes");
        }, 1500);
      }
    } catch (error) {
      console.error("Erro ao adicionar o cliente:", error);
      if (error.response) {
        if (error.response.status === 409) {
          alert("Erro: O Cliente já está cadastrado no sistema.");
        } else if (error.response.status === 401) {
          alert("Token inválido ou expirado. Por favor, faça login novamente.");
          localStorage.removeItem("token");
          navigate("auth/login");
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
            onChange={(e) => setNomeCliente(e.target.value)}
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
        <div>
          <Label>Fatura do Cliente:</Label>
          <Input
            type="number"
            value={faturaCliente}
            onChange={(e) => setFaturaCliente(e.target.value)}
            placeholder="Fatura do Cliente"
            required
          />
        </div>
        <div>
          <Label>Código do Cartão:</Label>
          <Input
            type="text"
            value={codigoCartao}
            onChange={(e) => setCodigoCartao(e.target.value)} // Apenas atualiza o valor do código do cartão
            placeholder="Passe o cartão ou digite o código"
            required
          />
        </div>
        <Button type="submit">Adicionar Cliente</Button>
      </Form>
    </Container>
  );
};

export default AddCliente;
