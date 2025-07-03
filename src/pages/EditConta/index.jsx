import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { ArrowLeft } from 'lucide-react';
import { Container, Title, Form, Input, Button, BackButton, Label, Message } from "../AddConta/styles";

const EditConta = () => {
  const { idConta } = useParams();
  const navigate = useNavigate();

  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [dtVencimento, setDtVencimento] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [messageType, setMessageType] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verificarPermissao = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/auth/login");
        return;
      }

      const decoded = jwtDecode(token);
      const userLogin = decoded.sub;

      const getRequestConfig = () => ({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
          (perm) => perm.tela === "Tela de Pagamentos"
        );

        const permissoes = permissoesTela?.permissoes || [];
        const hasPutPermission = permissoes.includes("PUT");

        setHasPermission(hasPutPermission);

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
    const fetchConta = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Você precisa estar logado!");
        navigate("/auth/login");
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          setError("Token expirado. Faça login novamente.");
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
          setError("Conta não encontrada.");
        }
      } catch (err) {
        setError("Erro ao carregar os dados da conta.");
      } finally {
        setLoading(false);
      }
    };

    fetchConta();
  }, [idConta, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Você precisa estar logado!");
      navigate("/auth/login");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        setError("Token expirado. Faça login novamente.");
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

      setMessageType("success");
      setMessage("Conta atualizada com sucesso!!");
      setTimeout(() => navigate("/pagamentos"), 2000);
    } catch (err) {
      setError("Erro ao atualizar a conta. Verifique os dados e tente novamente.");
    }
  };

  if (!hasPermission) return null;
  if (loading) return <p>Carregando...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <Container>
      <BackButton onClick={() => navigate("/pagamentos")}>
        <ArrowLeft size={20} /> Voltar
      </BackButton>
      <Title>Editar Conta</Title>
      {message && <Message type={messageType}>{message}</Message>}
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
