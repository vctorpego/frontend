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
  const [comandaAtiva, setComandaAtiva] = useState(null);
  const [pesoGramas, setPesoGramas] = useState("");
  const [clienteBuscado, setClienteBuscado] = useState(null);
  const [mensagem, setMensagem] = useState("");

  const navigate = useNavigate();
  const clienteInputRef = useRef(null);
  const pesoInputRef = useRef(null);

  const exibirMensagem = (texto) => {
    setMensagem(texto);
    setTimeout(() => setMensagem(""), 5000);
  };

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
    setMensagem(""); // limpa a mensagem ao iniciar nova busca
  
    if (!clienteId) return exibirMensagem("Digite um ID de cliente!");
  
    const token = getToken();
    if (!token) return;
  
    try {
      const response = await axios.get(`http://localhost:8080/cliente/${clienteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.status === 200 && response.data) {
        setCliente(response.data);
        setClienteBuscado(response.data);
        setProdutos([]);
        setValorTotal(0);
  
        const clienteRealId = response.data.id || response.data.idCliente;
        const comandaResponse = await axios.get(
          `http://localhost:8080/comanda/ultima/${clienteRealId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
  
        if (comandaResponse.status === 200 && comandaResponse.data && !comandaResponse.data.horaSaidaComanda) {
          setComandaAtiva(comandaResponse.data);
        } else {
          setComandaAtiva(null);
          exibirMensagem("Cliente não possui comanda ativa. Não é possível adicionar produtos.");
        }
      } else {
        setCliente(null);
        setComandaAtiva(null);
        exibirMensagem("Cliente não encontrado!");
      }
    } catch {
      setCliente(null);
      setComandaAtiva(null);
      exibirMensagem("Erro ao buscar cliente!");
    }
  };
  
  const atualizarVenda = async () => {
    const clienteAtualId = clienteBuscado?.id || clienteId;
    if (!clienteAtualId) return exibirMensagem("Busque um cliente antes de finalizar a venda!");

    const token = getToken();
    if (!token) return;

    if (!comandaAtiva || !comandaAtiva.idCompraComanda) {
      return exibirMensagem("Nenhuma comanda ativa encontrada para este cliente!");
    }

    try {
      const comandaId = comandaAtiva.idCompraComanda;

      const mapaProdutos = new Map();
      produtos.forEach((produto) => {
        const id = produto.idProduto;
        mapaProdutos.set(id, (mapaProdutos.get(id) || 0) + 1);
      });

      const comandaProdutos = Array.from(mapaProdutos.entries()).map(([idProduto, quantidade]) => ({
        idProduto,
        quantidade,
      }));

      await axios.put(`http://localhost:8080/comanda/${comandaId}`, {
        valorTotalComanda: valorTotal,
        comandaProdutos,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let saldoRestante = cliente.saldoCliente;
      let faturaRestante = cliente.faturaCliente;

      if (valorTotal <= saldoRestante) {
        await axios.put(`http://localhost:8080/cliente/atualizar-saldo/${clienteAtualId}`, {
          saldoCliente: saldoRestante - valorTotal,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        const restanteParaCobrar = valorTotal - saldoRestante;
        await axios.put(`http://localhost:8080/cliente/atualizar-saldo/${clienteAtualId}`, {
          saldoCliente: 0,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        await axios.put(`http://localhost:8080/cliente/atualizar-fatura/${clienteAtualId}`, {
          faturaCliente: faturaRestante - restanteParaCobrar,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      await axios.put(
        `http://localhost:8080/cliente/ultima-compra/${clienteAtualId}`,
        {
          ultimaCompraCliente: new Date().toISOString().split("T")[0],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProdutos([]);
      setValorTotal(0);
      exibirMensagem("Venda finalizada com sucesso!");
    } catch {
      exibirMensagem("Erro ao finalizar venda!");
    }
  };

  const handleScan = async (code) => {
    document.activeElement.blur();

    if (!cliente) return exibirMensagem("Busque um cliente antes de escanear produtos!");
    if (!comandaAtiva) return exibirMensagem("Cliente não possui comanda ativa. Não é possível adicionar produtos.");

    let cleanCode = code.replace(/\D/g, "");
    if (pesoGramas && pesoGramas.trim() !== "") {
      const pesoLido = pesoGramas.trim();
      if (cleanCode.startsWith(pesoLido)) {
        cleanCode = cleanCode.substring(pesoLido.length);
      }
    }

    const token = getToken();
    if (!token) return;

    try {
      const response = await axios.get(`http://localhost:8080/produto/codigobarras/${cleanCode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        const produto = response.data;
        const novoTotal = valorTotal + produto.precoProduto;
        const limitePermitido = cliente.saldoCliente + cliente.faturaCliente;

        if (novoTotal > limitePermitido) {
          return exibirMensagem("O total já atingiu o seu saldo + limite disponível!");
        }

        setProdutos((prev) => [...prev, produto]);
        setValorTotal(novoTotal);
      }
    } catch {
      exibirMensagem("Erro ao buscar produto!");
    }
  };

  const adicionarRefeicao = async () => {
    if (!comandaAtiva) return exibirMensagem("Cliente não possui comanda ativa. Não é possível adicionar refeições.");

    const peso = parseFloat(pesoGramas);
    if (isNaN(peso) || peso <= 0) return exibirMensagem("Informe um peso válido em gramas!");

    const token = getToken();
    if (!token) return;

    try {
      const response = await axios.get("http://localhost:8080/produto/1", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200 && response.data) {
        const produtoRefeicao = response.data;
        const precoPorKg = produtoRefeicao.precoProduto;
        const valorProporcional = (peso / 1000) * precoPorKg;

        const limitePermitido = cliente.saldoCliente + cliente.faturaCliente;
        if (valorTotal + valorProporcional > limitePermitido) {
          return exibirMensagem("O total já atingiu o seu saldo + limite disponível!");
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
        exibirMensagem("Produto de refeição não encontrado!");
      }
    } catch {
      exibirMensagem("Erro ao buscar produto refeição!");
    }
  };

  useBarcodeScanner(handleScan);

  return (
    <C.Container>
      <C.Title>Nova Comanda - TechMeal</C.Title>

      {mensagem && <C.Mensagem>{mensagem}</C.Mensagem>}

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

      {cliente && comandaAtiva && (
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
