import React, { useEffect, useState } from "react";
import {
    BarChart, Bar,
    PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer
} from "recharts";

import * as c from './styles';

import {
    fetchConsumoClientes,
    fetchStatusClientes,
    fetchFaturamentoMensal
} from "../services/dashboardService";

const Dashboard = () => {
    const [consumoClientes, setConsumoClientes] = useState([]);
    const [statusClientes, setStatusClientes] = useState([]);
    const [faturamentoMensal, setFaturamentoMensal] = useState([]);
    const [loading, setLoading] = useState(true);
    const coresPizza = ["#00C49F", "#FF8042"];

    useEffect(() => {
        async function loadData() {
            try {
                const [consumo, status, faturamento] = await Promise.all([
                    fetchConsumoClientes(),
                    fetchStatusClientes(),
                    fetchFaturamentoMensal()
                ]);
                setConsumoClientes(consumo);
                setStatusClientes(status);
                setFaturamentoMensal(faturamento);
            } catch (error) {
                console.error("Erro ao buscar dados do dashboard", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) return <p>Carregando dados do dashboard...</p>;

    return (
        <c.Container>
            <c.Title>Dashboard</c.Title>
            <c.ChartsWrapper>
                <c.ChartBox>
                    <h4>Consumo Total por Cliente</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={consumoClientes}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="consumo" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </c.ChartBox>

                <c.ChartBox>
                    <h4>Status dos Clientes</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={statusClientes}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                            >
                                {statusClientes.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={coresPizza[index % coresPizza.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </c.ChartBox>

                <c.ChartBox>
                    <h4>Faturamento Mensal</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={faturamentoMensal}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="mes" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="valor" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </c.ChartBox>
            </c.ChartsWrapper>
        </c.Container>
    );
};

export default Dashboard;
