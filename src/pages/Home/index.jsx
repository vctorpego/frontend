import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import {
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from "recharts";

import * as C from "./styles";
import useAuth from "../../hooks/useAuth";
import { fetchConsumoClientes } from "../../services/api";

const Home = () => {
  const { signout } = useAuth();
  const navigate = useNavigate();

  const [consumoClientes, setConsumoClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Verificação do token
  const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth/login");
      return null;
    }

    try {
      const decoded = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        localStorage.removeItem("token");
        navigate("/auth/login");
        return null;
      }
    } catch (error) {
      console.error("Erro ao decodificar o token:", error);
      localStorage.removeItem("token");
      navigate("/auth/login");
      return null;
    }

    return token;
  };

  // useEffect para verificar token e carregar dados
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    async function loadData() {
      try {
        const consumo = await fetchConsumoClientes();
        const dadosFormatados = consumo.map(cliente => ({
          name: cliente.nomeCliente,
          consumo: cliente.totalConsumido
        }));
        setConsumoClientes(dadosFormatados);
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [navigate]);

  if (loading) return <p>Carregando dados do dashboard...</p>;

  return (
    <C.Container>
      <C.Title>Dashboard</C.Title>
      <C.ChartsWrapper>
        <C.ChartBox>
          <h4>Consumo Total por Cliente</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={consumoClientes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="consumo" fill="#8884d8" name="Total Consumido (R$)" />
            </BarChart>
          </ResponsiveContainer>
        </C.ChartBox>
      </C.ChartsWrapper>
    </C.Container>
  );
};

export default Home;
