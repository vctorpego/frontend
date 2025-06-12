import React, { useEffect, useState } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Sidebar from "../../components/Sidebar";
import * as C from "./styles"; 
import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Relatorios = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Estados de exibição dos popups e seus campos
  const [showTicketPopup, setShowTicketPopup] = useState(false);
  const [ticketInicio, setTicketInicio] = useState("");
  const [ticketFim, setTicketFim] = useState("");
  const [pendingDownload, setPendingDownload] = useState(null);

  const [showAniversarioPopup, setShowAniversarioPopup] = useState(false);
  const [aniversarioDia, setAniversarioDia] = useState("");
  const [aniversarioMes, setAniversarioMes] = useState("");
  const [pendingAniversarioDownload, setPendingAniversarioDownload] = useState(null);

  const [showVendasPopup, setShowVendasPopup] = useState(false);
  const [vendasInicio, setVendasInicio] = useState("");
  const [vendasFim, setVendasFim] = useState("");
  const [pendingVendasDownload, setPendingVendasDownload] = useState(null);

  const [showDrePopup, setShowDrePopup] = useState(false);
  const [dreInicio, setDreInicio] = useState("");
  const [dreFim, setDreFim] = useState("");
  const [pendingDreDownload, setPendingDreDownload] = useState(null);

  const [showConsumoPopup, setShowConsumoPopup] = useState(false);
  const [consumoInicio, setConsumoInicio] = useState("");
  const [consumoFim, setConsumoFim] = useState("");
  const [pendingConsumoDownload, setPendingConsumoDownload] = useState(null);

  const relatorios = [
    { nome: "Relatório de Vendas", endpoint: "vendas-por-produto" },
    { nome: "Clientes Devedores", endpoint: "clientes-devedores" },
    { nome: "Ticket Médio", endpoint: "ticket-medio-clientes" },
    { nome: "Relatório DRE", endpoint: "dred-diario" },
    { nome: "Consumo", endpoint: "consumo" },
    { nome: "Aniversariantes do Dia", endpoint: "aniversariantes-dia" },
  ];

  const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth/login");
      return null;
    }
    try {
      const decoded = jwt_decode(token);
      if (decoded.exp < Date.now() / 1000) {
        localStorage.removeItem("token");
        navigate("/auth/login");
        return null;
      }
      setUser(decoded);
      return token;
    } catch (error) {
      localStorage.removeItem("token");
      navigate("/auth/login");
      return null;
    }
  };

  const getRequestConfig = () => {
    const token = getToken();
    return token
      ? { responseType: "blob", headers: { Authorization: `Bearer ${token}` } }
      : {};
  };

  const handleDownload = async (endpoint, params = {}) => {
    try {
      let url = `http://localhost:8080/relatorios/${endpoint}`;
      if (endpoint === "ticket-medio-clientes" && params.inicio && params.fim) {
        url += `?inicio=${encodeURIComponent(params.inicio)}&fim=${encodeURIComponent(params.fim)}`;
      }
      if (endpoint === "aniversariantes-dia" && params.dia && params.mes) {
        url += `?dia=${encodeURIComponent(params.dia)}&mes=${encodeURIComponent(params.mes)}`;
      }
      if (endpoint === "vendas-por-produto" && params.inicio && params.fim) {
        url += `?dataInicio=${encodeURIComponent(params.inicio)}&dataFim=${encodeURIComponent(params.fim)}`;
      }
      if (endpoint === "dred-diario" && params.inicio && params.fim) {
        url += `?dataInicio=${encodeURIComponent(params.inicio)}&dataFim=${encodeURIComponent(params.fim)}`;
      }
      if (endpoint === "consumo" && params.inicio && params.fim) {
        url += `?dataInicio=${encodeURIComponent(params.inicio)}&dataFim=${encodeURIComponent(params.fim)}`;
      }
      const response = await axios.post(
        url,
        ([
          "ticket-medio-clientes",
          "aniversariantes-dia",
          "vendas-por-produto",
          "dred-diario",
          "consumo",
        ].includes(endpoint)
          ? {}
          : params),
        getRequestConfig()
      );

      const blobUrl = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", `${endpoint}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      alert("Erro ao baixar relatório.");
    }
  };

  const handleCardClick = (rel) => {
    switch (rel.endpoint) {
      case "ticket-medio-clientes":
        setShowTicketPopup(true);
        setPendingDownload(rel.endpoint);
        break;
      case "aniversariantes-dia":
        setShowAniversarioPopup(true);
        setPendingAniversarioDownload(rel.endpoint);
        break;
      case "vendas-por-produto":
        setShowVendasPopup(true);
        setPendingVendasDownload(rel.endpoint);
        break;
      case "dred-diario":
        setShowDrePopup(true);
        setPendingDreDownload(rel.endpoint);
        break;
      case "consumo":
        setShowConsumoPopup(true);
        setPendingConsumoDownload(rel.endpoint);
        break;
      case "clientes-devedores":
        handleDownload(rel.endpoint);
        break;
      default:
        handleDownload(rel.endpoint);
    }
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketInicio || !ticketFim) {
      alert("Preencha as duas datas.");
      return;
    }
    setShowTicketPopup(false);
    handleDownload(pendingDownload, { inicio: ticketInicio, fim: ticketFim });
    setTicketInicio("");
    setTicketFim("");
    setPendingDownload(null);
  };

  const handleAniversarioSubmit = (e) => {
    e.preventDefault();
    const dia = parseInt(aniversarioDia, 10);
    const mes = parseInt(aniversarioMes, 10);
    if (!dia || !mes || dia < 1 || dia > 31 || mes < 1 || mes > 12) {
      alert("Informe um dia (1-31) e mês (1-12) válidos.");
      return;
    }
    setShowAniversarioPopup(false);
    handleDownload(pendingAniversarioDownload, { dia, mes });
    setAniversarioDia("");
    setAniversarioMes("");
    setPendingAniversarioDownload(null);
  };

  const handleVendasSubmit = (e) => {
    e.preventDefault();
    if (!vendasInicio || !vendasFim) {
      alert("Preencha as duas datas.");
      return;
    }
    setShowVendasPopup(false);
    handleDownload(pendingVendasDownload, { inicio: vendasInicio, fim: vendasFim });
    setVendasInicio("");
    setVendasFim("");
    setPendingVendasDownload(null);
  };

  const handleDreSubmit = (e) => {
    e.preventDefault();
    if (!dreInicio || !dreFim) {
      alert("Preencha as duas datas.");
      return;
    }
    setShowDrePopup(false);
    handleDownload(pendingDreDownload, { inicio: dreInicio, fim: dreFim });
    setDreInicio("");
    setDreFim("");
    setPendingDreDownload(null);
  };

  const handleConsumoSubmit = (e) => {
    e.preventDefault();
    if (!consumoInicio || !consumoFim) {
      alert("Preencha as duas datas.");
      return;
    }
    setShowConsumoPopup(false);
    handleDownload(pendingConsumoDownload, { inicio: consumoInicio, fim: consumoFim });
    setConsumoInicio("");
    setConsumoFim("");
    setPendingConsumoDownload(null);
  };

  useEffect(() => {
    getToken();
  }, []);

  return (
    <C.Container>
      <Sidebar user={user} />
      <C.Content>
        <C.Title>Relatórios</C.Title>
        <C.CardContainer>
          {relatorios.map((rel, idx) => (
            <C.Card key={idx} onClick={() => handleCardClick(rel)}>
              <FileText size={40} color="#007bff" />
              <span>{rel.nome}</span>
            </C.Card>
          ))}
        </C.CardContainer>

        {showTicketPopup && (
          <C.ModalOverlay>
            <C.ModalForm onSubmit={handleTicketSubmit}>
              <C.ModalTitle>Informe o período</C.ModalTitle>
              <C.ModalLabel>
                Data de início:
                <C.ModalInput
                  type="date"
                  value={ticketInicio}
                  onChange={(e) => setTicketInicio(e.target.value)}
                  required
                />
              </C.ModalLabel>
              <C.ModalLabel>
                Data de fim:
                <C.ModalInput
                  type="date"
                  value={ticketFim}
                  onChange={(e) => setTicketFim(e.target.value)}
                  required
                />
              </C.ModalLabel>
              <C.ModalButtonContainer>
                <C.ModalCancelButton
                  type="button"
                  onClick={() => setShowTicketPopup(false)}
                >
                  Cancelar
                </C.ModalCancelButton>
                <C.ModalSubmitButton type="submit">
                  Baixar Relatório
                </C.ModalSubmitButton>
              </C.ModalButtonContainer>
            </C.ModalForm>
          </C.ModalOverlay>
        )}

        {showAniversarioPopup && (
          <C.ModalOverlay>
            <C.ModalForm onSubmit={handleAniversarioSubmit}>
              <C.ModalTitle>Informe dia e mês</C.ModalTitle>
              <C.ModalLabel>
                Dia:
                <C.ModalInput
                  type="number"
                  min="1"
                  max="31"
                  value={aniversarioDia}
                  onChange={(e) => setAniversarioDia(e.target.value)}
                  required
                />
              </C.ModalLabel>
              <C.ModalLabel>
                Mês:
                <C.ModalInput
                  type="number"
                  min="1"
                  max="12"
                  value={aniversarioMes}
                  onChange={(e) => setAniversarioMes(e.target.value)}
                  required
                />
              </C.ModalLabel>
              <C.ModalButtonContainer>
                <C.ModalCancelButton
                  type="button"
                  onClick={() => setShowAniversarioPopup(false)}
                >
                  Cancelar
                </C.ModalCancelButton>
                <C.ModalSubmitButton type="submit">
                  Baixar Relatório
                </C.ModalSubmitButton>
              </C.ModalButtonContainer>
            </C.ModalForm>
          </C.ModalOverlay>
        )}

        {showVendasPopup && (
          <C.ModalOverlay>
            <C.ModalForm onSubmit={handleVendasSubmit}>
              <C.ModalTitle>Informe o período</C.ModalTitle>
              <C.ModalLabel>
                Data de início:
                <C.ModalInput
                  type="date"
                  value={vendasInicio}
                  onChange={(e) => setVendasInicio(e.target.value)}
                  required
                />
              </C.ModalLabel>
              <C.ModalLabel>
                Data de fim:
                <C.ModalInput
                  type="date"
                  value={vendasFim}
                  onChange={(e) => setVendasFim(e.target.value)}
                  required
                />
              </C.ModalLabel>
              <C.ModalButtonContainer>
                <C.ModalCancelButton
                  type="button"
                  onClick={() => setShowVendasPopup(false)}
                >
                  Cancelar
                </C.ModalCancelButton>
                <C.ModalSubmitButton type="submit">
                  Baixar Relatório
                </C.ModalSubmitButton>
              </C.ModalButtonContainer>
            </C.ModalForm>
          </C.ModalOverlay>
        )}

        {showDrePopup && (
          <C.ModalOverlay>
            <C.ModalForm onSubmit={handleDreSubmit}>
              <C.ModalTitle>Informe o período</C.ModalTitle>
              <C.ModalLabel>
                Data de início:
                <C.ModalInput
                  type="date"
                  value={dreInicio}
                  onChange={(e) => setDreInicio(e.target.value)}
                  required
                />
              </C.ModalLabel>
              <C.ModalLabel>
                Data de fim:
                <C.ModalInput
                  type="date"
                  value={dreFim}
                  onChange={(e) => setDreFim(e.target.value)}
                  required
                />
              </C.ModalLabel>
              <C.ModalButtonContainer>
                <C.ModalCancelButton
                  type="button"
                  onClick={() => setShowDrePopup(false)}
                >
                  Cancelar
                </C.ModalCancelButton>
                <C.ModalSubmitButton type="submit">
                  Baixar Relatório
                </C.ModalSubmitButton>
              </C.ModalButtonContainer>
            </C.ModalForm>
          </C.ModalOverlay>
        )}

        {showConsumoPopup && (
          <C.ModalOverlay>
            <C.ModalForm onSubmit={handleConsumoSubmit}>
              <C.ModalTitle>Informe o período</C.ModalTitle>
              <C.ModalLabel>
                Data de início:
                <C.ModalInput
                  type="date"
                  value={consumoInicio}
                  onChange={(e) => setConsumoInicio(e.target.value)}
                  required
                />
              </C.ModalLabel>
              <C.ModalLabel>
                Data de fim:
                <C.ModalInput
                  type="date"
                  value={consumoFim}
                  onChange={(e) => setConsumoFim(e.target.value)}
                  required
                />
              </C.ModalLabel>
              <C.ModalButtonContainer>
                <C.ModalCancelButton
                  type="button"
                  onClick={() => setShowConsumoPopup(false)}
                >
                  Cancelar
                </C.ModalCancelButton>
                <C.ModalSubmitButton type="submit">
                  Baixar Relatório
                </C.ModalSubmitButton>
              </C.ModalButtonContainer>
            </C.ModalForm>
          </C.ModalOverlay>
        )}
      </C.Content>
    </C.Container>
  );
};

export default Relatorios;
