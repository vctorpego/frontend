import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode"; // Adicionado
import * as C from "./styles"; // Importa estilos personalizados
import { Message } from "../AddConta/styles";


const PagarConta = () => {
  const { id } = useParams();
  const [conta, setConta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasPermission, setHasPermission] = useState(false); // Novo estado
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

      const decoded = jwt_decode(token);
      const userLogin = decoded.sub;

      const getRequestConfig = () => ({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      try {
        const userResponse = await axios.get(
          `http://localhost:8080/usuario/id/${userLogin}`,
          getRequestConfig()
        );
        const userId = userResponse.data;

        const permissionsResponse = await axios.get(
          `http://localhost:8080/permissao/telas/${userId}`,
          getRequestConfig()
        );

        const permissoesTela = permissionsResponse.data.find(
          (perm) => perm.tela === "Tela de Pagamentos"
        );

        const permissoes = permissoesTela?.permissoes || [];
        const hasPostPermission = permissoes.includes("POST");

        setHasPermission(hasPostPermission);

        if (!hasPostPermission) {
          navigate("/nao-autorizado");
        } else {
          // Se tiver permissão, então carrega os dados da conta
          if (id) {
            const response = await axios.get(
              `http://localhost:8080/controlecontas/${id}`,
              getRequestConfig()
            );
            setConta(response.data);
          } else {
            setError("ID da conta inválido.");
          }
        }
      } catch (error) {
        console.error("Erro ao verificar permissões ou carregar conta:", error);
        setError("Erro ao verificar permissões ou carregar dados.");
        navigate("/nao-autorizado");
      } finally {
        setLoading(false);
      }
    };

    verificarPermissao();
  }, [id, navigate]);

  const handlePagamento = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Token não encontrado. Faça login novamente.");
      localStorage.removeItem(token);
      navigate("/auth/login")
      
      return;
    }

    if (!id) {
      setError("ID da conta inválido.");
      return;
    }

    if (conta.statusControleContas === "Paga") {
      setMessageType("success");
      setMessage("A conta já está paga!");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/controlecontas/pagar/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        setMessageType("success");
        setMessage("Pagamento realizado com sucesso!");
        setConta((prev) => ({ ...prev, statusControleContas: "Paga" }));
      } else {
        setError("Erro ao processar o pagamento. Tente novamente.");
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Erro desconhecido na API.");
      } else if (err.request) {
        setError("Nenhuma resposta do servidor.");
      } else {
        setError("Erro inesperado. Verifique o console.");
      }
    }
  };

  const handleRedirectToPagamentos = () => {
    navigate("/pagamentos", { replace: true });
  };

  if (loading) return <p>Carregando...</p>;
  if (!hasPermission) return null; // Evita renderização antes da verificação

  return (
    <C.Container>
      <C.Title>Pagar Conta</C.Title>
      {message && <Message type={messageType}>{message}</Message>}
      <C.Form>
        <h2>Detalhes da Conta</h2>
        <C.Label><strong>Empresa:</strong></C.Label>
        <p>{conta.fornecedor?.nomeSocialFornecedor || "Não informado"}</p>
        <C.Label><strong>Valor:</strong></C.Label>
        <p>R${conta.valorControleContas || "0,00"}</p>
        <C.Label><strong>Vencimento:</strong></C.Label>
        <p>{conta.dtVencimentoControleContas || "Data não disponível"}</p>
        <C.Label><strong>Status:</strong></C.Label>
        <p>{conta.statusControleContas}</p>
        <C.Button onClick={handlePagamento}>Efetuar Pagamento</C.Button>
        <C.Button onClick={handleRedirectToPagamentos}>Voltar</C.Button>
      </C.Form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </C.Container>
  );
};

export default PagarConta;
