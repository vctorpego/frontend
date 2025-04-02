import { useRef, useState } from "react";
import useBarcodeScanner from "../../hooks/useBarcodeScanner";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import * as C from "./styles";

function Vendas() {
  const [clienteId, setClienteId] = useState("");
  const [cliente, setCliente] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [valorTotal, setValorTotal] = useState(0);
  const [primeiroScan, setPrimeiroScan] = useState(true);
  const navigate = useNavigate();
  const clienteInputRef = useRef(null);

  const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("Token não encontrado. Redirecionando para login...");
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
    } catch (error) {
      console.error("Erro ao decodificar o token:", error);
      localStorage.removeItem("token");
      navigate("/auth/login");
      return null;
    }
    return token;
  };

  const [clienteBuscado, setClienteBuscado] = useState(null);

  const buscarCliente = async () => {
    if (!clienteId) {
      alert("Digite um ID de cliente!");
      return;
    }
    try {
      const token = getToken();
      if (!token) return;
      const response = await axios.get(`http://localhost:8080/cliente/${clienteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200 && response.data) {
        setCliente(response.data);
        setClienteBuscado(response.data);

        setProdutos([]);
        setValorTotal(0);
        setPrimeiroScan(true);
        console.log("Cliente encontrado:", response.data);
      } else {
        alert("Cliente não encontrado!");
      }
    } catch (error) {
      console.error("Erro ao buscar cliente:", error);
      alert("Erro ao buscar cliente!");
    }
  };

  const atualizarVenda = async () => {
    const clienteAtualId = clienteBuscado?.id || clienteId;

    if (!clienteAtualId) {
      alert("Busque um cliente antes de atualizar a venda!");
      return;
    }

    const token = getToken();
    if (!token) return;

    try {
      const endpointBusca = `http://localhost:8080/comanda/ultima/${clienteAtualId}`;
      console.log("Chamando GET:", endpointBusca);

      const response = await axios.get(endpointBusca, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Resposta da busca de comanda:", response.data);

      if (response.status !== 200 || !response.data?.idCompraComanda) {
        alert("Nenhuma comanda encontrada para este cliente!");
        return;
      }

      const comandaId = response.data.idCompraComanda;
      const endpointAtualizacao = `http://localhost:8080/comanda/${comandaId}`;
      console.log("Chamando PUT:", endpointAtualizacao);

      const comandaData = {
        produtos: [...produtos], // 🔹 Garante que sempre será um array
        valorTotal: valorTotal,
      };
      

      console.log("Dados enviados no PUT:", JSON.stringify(comandaData, null, 2));

      await axios.put(endpointAtualizacao, comandaData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Venda atualizada com sucesso!");
      setProdutos([]);
      setValorTotal(0);
    } catch (error) {
      console.error("Erro ao atualizar venda:", error);
      alert("Erro ao atualizar venda!");
    }
  };

  const handleScan = async (code) => {
    console.log("Código escaneado (antes da correção):", code);

    if (!cliente) {
      alert("Busque um cliente antes de escanear produtos!");
      return;
    }

    if (primeiroScan && code.length > 1) {
      code = code.substring(1);
      setPrimeiroScan(false);
    }

    console.log("Código escaneado (após a correção):", code);

    try {
      const token = getToken();
      if (!token) return;
      const response = await axios.get(`http://localhost:8080/produto/codigobarras/${code}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setProdutos((prev) => [...prev, response.data]);
        setValorTotal((prevTotal) => prevTotal + response.data.precoProduto);
        console.log("Produto encontrado:", response.data);
      } else {
        console.log("Produto não encontrado!");
      }
    } catch (error) {
      console.error("Erro ao buscar produto:", error);
    }
  };

  useBarcodeScanner(handleScan);

  return (
    <C.Container>
      <C.Title>Nova Comanda - TechMeal</C.Title>
      <div>
        <C.Input
          ref={clienteInputRef}
          type="text"
          placeholder="Digite o ID do cliente..."
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
        />
        <div style={{ display: "flex", gap: "10px" }}>
          <C.Button onClick={buscarCliente}>Buscar Cliente</C.Button>
          <C.Button onClick={atualizarVenda}>Atualizar Venda</C.Button>
        </div>
      </div>
      {cliente && <h2>Cliente: {cliente.nomeCliente}</h2>}
      <h3>Valor Total: R$ {valorTotal.toFixed(2)}</h3>
      {produtos.length === 0 ? (
        <C.Description>Nenhum produto escaneado ainda.</C.Description>
      ) : (
        <C.ProductList>
          {produtos.map((produto, index) => (
            <C.ProductItem key={index}>
              <span>{produto.nomeProduto}</span>
              <C.ProductPrice>R$ {produto.precoProduto}</C.ProductPrice>
            </C.ProductItem>
          ))}
        </C.ProductList>
      )}
    </C.Container>
  );
}

export default Vendas;