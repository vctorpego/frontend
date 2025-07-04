import { useRef, useState } from "react";
import useCodeScanner from "../../hooks/useCodeScanner";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { Trash } from "lucide-react";
import * as C from "./styles";

function Vendas() {
  const [user, setUser] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [valorTotal, setValorTotal] = useState(0);
  const [comandaAtiva, setComandaAtiva] = useState(null);
  const [pesoGramas, setPesoGramas] = useState("");
  const [clienteBuscado, setClienteBuscado] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [clienteCartao, setClienteCartao] = useState("");

  const navigate = useNavigate();
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

  const buscarClientePorCartao = async (cartao) => {
    setMensagem("");

    if (!cartao) return exibirMensagem("Cartão não detectado!");

    const token = getToken();
    if (!token) return;

    try {
      const response = await axios.get(`http://localhost:8080/cliente/cartao/${cartao}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200 && response.data) {
        setCliente(response.data);
        setClienteBuscado(response.data);
        setProdutos([]);
        setValorTotal(0);

        const clienteRealId = response.data.idCliente;
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
          exibirMensagem("Cliente não possui comanda ativa.");
        }
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setCliente(null);
          setComandaAtiva(null);
          exibirMensagem("Cliente não possui comanda ativa!");
        } else {
          console.error("Erro na API:", error.response.status);
          exibirMensagem("Erro ao buscar cliente!");
        }
      } else {
        console.error("Erro desconhecido:", error);
        exibirMensagem("Erro de conexão com o servidor!");
      }
    }
  };

  const atualizarVenda = async () => {
    const clienteAtualId = clienteBuscado?.idCliente || clienteCartao; // Usando idCliente agora
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
      setCliente(null);
      setComandaAtiva(null);
      setClienteBuscado(null);
      setPesoGramas("");
      setClienteCartao("");
      exibirMensagem("Venda finalizada com sucesso!");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          setCliente(null);
          setComandaAtiva(null);
          exibirMensagem("Comanda já com produtos, finalize a comanda!");
        }


      } else {
        exibirMensagem("Erro ao finalizar venda!");
      }

    }
  };

  const handleExcluirProduto = (produto) => {
    setProdutos((prev) => prev.filter((p) => p !== produto));
    setValorTotal((prevTotal) => prevTotal - produto.precoProduto);
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

  useCodeScanner((data, tipo) => {
    console.log("Scanner callback:", data, tipo);
    if (tipo === "card") {
      setClienteCartao(data);
      buscarClientePorCartao(data);
    } else if (tipo === "barcode") {
      handleScan(data);
    }
  });
  
/*
  const obterPesoDaBalanca = async () => {
    console.log("Entrou na função")
    try {
      const response = await axios.get("http://localhost:3000/getPeso");

      if (response.status === 200 && response.data && response.data.peso) {
        setPesoGramas(response.data.peso.toString());
        console.log("Peso obtido da balança:", response.data.peso);

      } else {
        exibirMensagem("Não foi possível obter o peso da balança.");
      }
    } catch {
      exibirMensagem("Erro ao se comunicar com a balança.");
    }
  };

  const adicionarRefeicao = async () => {
    if (!comandaAtiva) return exibirMensagem("Cliente não possui comanda ativa.");
    const peso = parseFloat(pesoGramas);
    if (isNaN(peso) || peso <= 0) return exibirMensagem("Peso inválido!");
    const token = getToken();
    if (!token) return;

    try {
      const response = await axios.get("http://localhost:8080/produto/1", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200 && response.data) {
        console.log("Produto de refeição encontrado:", response.data);

        const produtoRefeicao = response.data;
        const precoPorKg = produtoRefeicao.precoProduto;
        const valorProporcional = (peso) * precoPorKg;

        const limitePermitido = cliente.saldoCliente + cliente.faturaCliente;
        if (valorTotal + valorProporcional > limitePermitido) {
          return exibirMensagem("Total excede saldo + limite.");
        }

        const produtoComPeso = {
          ...produtoRefeicao,
          nomeProduto: `${produtoRefeicao.nomeProduto} (${peso}g)`,
          precoProduto: valorProporcional,
        };

        setProdutos((prev) => [...prev, produtoComPeso]);
        setValorTotal((prevTotal) => prevTotal + valorProporcional);
        setValorUltimaRefeicao(valorProporcional);
        setPesoGramas("");
        pesoInputRef.current?.blur();

        console.log("Produto adicionado:", valorProporcional);
      } else {
        exibirMensagem("Produto de refeição não encontrado!");
      }
    } catch {
    }
  };
*/

  const adicionarRefeicao = async () => {
    if (!comandaAtiva) return exibirMensagem("Cliente não possui comanda ativa.");

    let peso = parseFloat(pesoGramas);

    // Se o peso não estiver preenchido, consulta a balança
    if (isNaN(peso) || peso <= 0) {
      try {
        const response = await axios.get("http://localhost:3000/getPeso");
        if (response.status === 200 && response.data && response.data.peso) {
          peso = parseFloat(response.data.peso);
        } else {
          return exibirMensagem("Não foi possível obter o peso da balança.");
        }
      } catch {
        return exibirMensagem("Erro ao se comunicar com a balança.");
      }
    }

    if (isNaN(peso) || peso <= 0) return exibirMensagem("Peso inválido!");

    const token = getToken();
    if (!token) return;

    try {
      const response = await axios.get("http://localhost:8080/produto/1", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200 && response.data) {
        const produtoRefeicao = response.data;
        const precoPorKg = produtoRefeicao.precoProduto;
        const valorProporcional = peso * precoPorKg;

        const limitePermitido = cliente.saldoCliente + cliente.faturaCliente;
        if (valorTotal + valorProporcional > limitePermitido) {
          return exibirMensagem("Total excede saldo + limite.");
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
      exibirMensagem("Erro ao buscar produto de refeição.");
    }
  };

  return (
    <C.Container>
      <C.Card>
        <C.Title>Nova Comanda - TechMeal</C.Title>

        {mensagem && <C.Mensagem>{mensagem}</C.Mensagem>}

        {cliente && (
          <C.InfoGroup>
            <C.InfoItem>
              <span>Cliente:</span> <strong>{cliente.nomeCliente}</strong>
            </C.InfoItem>
            <C.InfoItem>
              <span>Total:</span> <strong>R$ {valorTotal.toFixed(2)}</strong>
            </C.InfoItem>
          </C.InfoGroup>
        )}

        {cliente && comandaAtiva && (
          <>
            <C.SubTitle>Adicionar Refeição (por peso)</C.SubTitle>
            <C.FieldGroup>
              <C.Input
                ref={pesoInputRef}
                type="number"
                placeholder="Peso em gramas (ou deixe em branco)"
                value={pesoGramas}
                onChange={(e) => setPesoGramas(e.target.value)}
              />
              <Button Text="Adicionar Refeição" onClick={() => adicionarRefeicao()} />
            </C.FieldGroup>
          </>
        )}

        {produtos.length > 0 && (
          <>
            <C.ProductList>
              {produtos.map((produto, index) => (
                <C.ProductItem key={index}>
                  <span>{produto.nomeProduto}</span>
                  <C.ProductPrice>R$ {produto.precoProduto.toFixed(2)}</C.ProductPrice>
                  <Trash
                    size={20}
                    style={{ cursor: "pointer", color: "#dc3545", marginLeft: "10px" }}
                    onClick={() => handleExcluirProduto(produto)}
                  />
                </C.ProductItem>
              ))}
            </C.ProductList>


            <C.AddRefeicaoWrapper>
              <Button Text="Finalizar Venda" onClick={atualizarVenda} />
            </C.AddRefeicaoWrapper>
          </>
        )}

        {produtos.length === 0 && (
          <C.Description>Nenhum produto escaneado ainda.</C.Description>
        )}

      </C.Card>
    </C.Container>

  );
}

export default Vendas;