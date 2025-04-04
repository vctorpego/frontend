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
  const pesoInputRef = useRef(null);
  const [pesoGramas, setPesoGramas] = useState("");
  const [clienteBuscado, setClienteBuscado] = useState(null);

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
    } catch {
      localStorage.removeItem("token");
      navigate("/auth/login");
      return null;
    }
    return token;
  };

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
      } else {
        alert("Cliente não encontrado!");
      }
    } catch {
      alert("Erro ao buscar cliente!");
    }
  };

  const atualizarVenda = async () => {
    const clienteAtualId = clienteBuscado?.id || clienteId;
  
    if (!clienteAtualId) {
      alert("Busque um cliente antes de finalizar a venda!");
      return;
    }
  
    const token = getToken();
    if (!token) return;
  
    try {
      const response = await axios.get(`http://localhost:8080/comanda/ultima/${clienteAtualId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.status !== 200 || !response.data?.idCompraComanda) {
        alert("Nenhuma comanda encontrada para este cliente!");
        return;
      }
  
      const comandaId = response.data.idCompraComanda;
  
      // Agrupa produtos por ID e conta quantidades
      const mapaProdutos = new Map();
      produtos.forEach((produto) => {
        const id = produto.idProduto;
        if (mapaProdutos.has(id)) {
          mapaProdutos.set(id, mapaProdutos.get(id) + 1);
        } else {
          mapaProdutos.set(id, 1);
        }
      });
  
      const comandaProdutos = Array.from(mapaProdutos.entries()).map(([idProduto, quantidade]) => ({
        idProduto,
        quantidade,
      }));
  
      const comandaData = {
        valorTotalComanda: valorTotal,
        comandaProdutos,
      };
  
      await axios.put(`http://localhost:8080/comanda/${comandaId}`, comandaData, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      alert("Venda finalizada com sucesso!");
      setProdutos([]);
      setValorTotal(0);
    } catch {
      alert("Erro ao finalizar venda!");
    }
  };
  

  const handleScan = async (code) => {
    document.activeElement.blur();

    if (!cliente) {
      alert("Busque um cliente antes de escanear produtos!");
      return;
    }

    let cleanCode = code.replace(/\D/g, "");

    if (pesoGramas && pesoGramas.trim() !== "") {
      const pesoLido = pesoGramas.trim();
      if (cleanCode.startsWith(pesoLido)) {
        cleanCode = cleanCode.substring(pesoLido.length);
      }
    }

    try {
      const token = getToken();
      if (!token) return;

      const response = await axios.get(`http://localhost:8080/produto/codigobarras/${cleanCode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        const produto = response.data;
        const novoTotal = valorTotal + produto.precoProduto;
        const limitePermitido = cliente.saldoCliente + cliente.faturaCliente;

        if (novoTotal > limitePermitido) {
          alert("O total já atingiu o seu saldo + limite disponível!");
          return;
        }

        setProdutos((prev) => [...prev, produto]);
        setValorTotal(novoTotal);
      }
    } catch {
      alert("Erro ao buscar produto!");
    }
  };

  const adicionarRefeicao = async () => {
    const peso = parseFloat(pesoGramas);
    if (isNaN(peso) || peso <= 0) {
      alert("Informe um peso válido em gramas!");
      return;
    }

    const token = getToken();
    if (!token) return;

    try {
      const response = await axios.get("http://localhost:8080/produto/2", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200 && response.data) {
        const produtoRefeicao = response.data;
        const precoPorKg = produtoRefeicao.precoProduto;
        const valorProporcional = (peso / 1000) * precoPorKg;

        const limitePermitido = cliente.saldoCliente + cliente.faturaCliente;
        if (valorTotal + valorProporcional > limitePermitido) {
          alert("O total já atingiu o seu saldo + limite disponível!");
          return;
        }

        const produtoComPeso = {
          ...produtoRefeicao,
          nomeProduto: `${produtoRefeicao.nomeProduto} (${peso}g)`,
          precoProduto: valorProporcional,
        };

        setProdutos((prev) => [...prev, produtoComPeso]);
        setValorTotal((prevTotal) => prevTotal + valorProporcional);
        setPesoGramas("");
        pesoInputRef.current?.blur();
      } else {
        alert("Produto de refeição não encontrado!");
      }
    } catch {
      alert("Erro ao buscar produto refeição!");
    }
  };

  useBarcodeScanner(handleScan);

  return (
    <C.Container>
      <C.Title>Nova Comanda - TechMeal</C.Title>

      <C.FieldGroup>
        <C.Input
          ref={clienteInputRef}
          type="text"
          placeholder="Digite o ID do cliente..."
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
        />
        <C.Button onClick={buscarCliente}>Buscar Cliente</C.Button>
      </C.FieldGroup>

      {cliente && <C.ClienteNome>Cliente: {cliente.nomeCliente}</C.ClienteNome>}
      {cliente && <C.ValorTotal>Valor Total: R$ {valorTotal.toFixed(2)}</C.ValorTotal>}

      {cliente && (
        <>
          <C.SubTitle>Adicionar Refeição (por peso)</C.SubTitle>
          <C.FieldGroup>
            <C.Input
              ref={pesoInputRef}
              type="number"
              placeholder="Peso em gramas"
              value={pesoGramas}
              onChange={(e) => setPesoGramas(e.target.value)}
            />
            <C.Button onClick={adicionarRefeicao}>Adicionar Refeição</C.Button>
          </C.FieldGroup>
        </>
      )}

      {produtos.length === 0 ? (
        <C.Description>Nenhum produto escaneado ainda.</C.Description>
      ) : (
        <C.ProductList>
          {produtos.map((produto, index) => (
            <C.ProductItem key={index}>
              <span>{produto.nomeProduto}</span>
              <C.ProductPrice>R$ {produto.precoProduto.toFixed(2)}</C.ProductPrice>
            </C.ProductItem>
          ))}
        </C.ProductList>
      )}

      {cliente && produtos.length > 0 && (
        <C.FieldGroup style={{ marginTop: "30px", justifyContent: "center" }}>
          <C.Button onClick={atualizarVenda}>Finalizar Venda</C.Button>
        </C.FieldGroup>
      )}
    </C.Container>
  );
}

export default Vendas;