import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { Container, Title, Form, Input, Button, Label } from "../AddCliente/styles";

const EditConta = () => {
  const { idConta } = useParams();
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [dtVencimento, setDtVencimento] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConta = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        alert("Você precisa estar logado!");
        navigate("/auth/login");
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          alert("Token expirado. Faça login novamente.");
          localStorage.removeItem("token");
          navigate("/auth/login");
          return;
        }

        const response = await axios.get(`http://localhost:8080/controlecontas/${idConta}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200 && response.data) {
          const { descricaoControleContas, valorControleContas, dtVencimentoControleContas } = response.data;
          setDescricao(descricaoControleContas || "");
          setValor(valorControleContas || "");
          setDtVencimento(dtVencimentoControleContas || "");
        } else {
          alert("Erro ao carregar a conta. Resposta inesperada do servidor.");
        }
      } catch (error) {
        console.error("Erro ao buscar a conta:", error);
        alert("Erro ao carregar a conta. Verifique sua conexão com o servidor.");
      }
    };

    fetchConta();
  }, [idConta, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!descricao || !valor || !dtVencimento) {
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
      if (decodedToken.exp * 1000 < Date.now()) {
        alert("Token expirado. Faça login novamente.");
        localStorage.removeItem("token");
        navigate("/auth/login");
        return;
      }

      await axios.put(
        `http://localhost:8080/controlecontas/alterar/${idConta}`,
        {
          descricaoControleContas: descricao,
          valorControleContas: valor,
          dtVencimentoControleContas: dtVencimento,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Conta atualizada com sucesso!");
      navigate("/pagamentos");
    } catch (error) {
      console.error("Erro ao atualizar a conta:", error);
      alert("Erro ao atualizar a conta.");
    }
  };

  return (
    <Container>
      <Title>Editar Conta</Title>
      <Form onSubmit={handleSubmit}>
        <div>
          <Label>Descrição:</Label>
          <Input 
            type="text" 
            value={descricao} 
            onChange={(e) => setDescricao(e.target.value)} 
            required 
          />
        </div>
        <div>
          <Label>Valor:</Label>
          <Input 
            type="number" 
            value={valor} 
            onChange={(e) => setValor(e.target.value)} 
            required 
          />
        </div>
        <div>
          <Label>Data de Vencimento:</Label>
          <Input 
            type="date" 
            value={dtVencimento} 
            onChange={(e) => setDtVencimento(e.target.value)} 
            required 
          />
        </div>
        <Button type="submit">Atualizar Conta</Button>
      </Form>
    </Container>
  );
};

export default EditConta;
