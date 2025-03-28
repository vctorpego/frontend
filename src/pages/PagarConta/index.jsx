import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import * as C from "./styles"; // Importa estilos personalizados

const PagarConta = () => {
  const { id } = useParams(); // Obtém o ID da URL
  const [conta, setConta] = useState(null); // Estado para armazenar os dados da conta
  const [loading, setLoading] = useState(true); // Controle de carregamento
  const [error, setError] = useState(null); // Controle de erros
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConta = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Token não encontrado. Faça login novamente.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/controlecontas/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setConta(response.data);
      } catch (error) {
        setError("Erro ao carregar os dados da conta. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchConta();
    } else {
      setError("ID da conta inválido.");
      setLoading(false);
    }
  }, [id]);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const handlePagamento = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Token não encontrado. Faça login novamente.");
      return;
    }

    if (!id) {
      setError("ID da conta inválido.");
      return;
    }

    if (conta.statusControleContas === "Paga") {
      alert("Conta já está paga.");
      navigate("/pagamentos", { replace: true }); // Redireciona imediatamente
      return; // Impede que o restante do código seja executado
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
        alert("Pagamento realizado com sucesso!");
        navigate("/pagamentos", { replace: true });

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
    navigate("/pagamentos", { replace: true }); // Redireciona diretamente para a página de pagamentos
  };

  return (
    <C.Container>
      <C.Title>Pagar Conta</C.Title>
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
        <C.Button onClick={handleRedirectToPagamentos}>Voltar</C.Button> {/* Novo botão */}
      </C.Form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </C.Container>
  );
};

export default PagarConta;
