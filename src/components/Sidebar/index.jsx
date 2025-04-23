import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import jwtDecode from "jwt-decode";
import useAuth from "../../hooks/useAuth";
import api from "../../services/api";
import * as C from "./styles";
import {
  CupSoda, LayoutDashboard, Box, Users, ShoppingCart,
  DollarSign, FileText, User, ArrowRightCircle, LogOut, Banknote
} from "lucide-react";

const Sidebar = () => {
  const [permissoes, setPermissoes] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // <- começa como false

  const { signout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const temPermissao = (tela, acao) => {
    const telaPermissoes = permissoes.find(p => p.tela === tela);
    return telaPermissoes ? telaPermissoes.permissoes.includes(acao) : false;
  };

  useEffect(() => {
    const fetchDados = async () => {
      setCarregando(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setIsLoggedIn(false);
        setCarregando(false);
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken?.sub;

        if (!userId) {
          setIsLoggedIn(false);
          return;
        }

        const responseUser = await api.get(`/usuario/id/${userId}`);
        const user = responseUser.data;
        setUsuario(user);

        const responsePermissoes = await api.get(`/permissao/telas/${user}`);
        setPermissoes(responsePermissoes.data);

        setIsLoggedIn(true);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setPermissoes([]);
        setIsLoggedIn(false);
      } finally {
        setCarregando(false);
      }
    };

    fetchDados();
  }, []);

  const logout = () => {
    signout();
    navigate("/", { replace: true });
  };

  // Enquanto carrega, não mostra nada
  if (carregando) return null;

  // Se não estiver logado, também não mostra nada
  if (!isLoggedIn) return null;

  return (
    <C.SidebarContainer>
      <C.Logo>
        <CupSoda size={30} />
        <C.LogoText>TechMeal</C.LogoText>
      </C.Logo>

      <C.Menu>
        {temPermissao('Tela de Dashboard', 'GET') && (
          <C.MenuItem onClick={() => navigate("/home")} isActive={isActive("/home")}>
            <LayoutDashboard size={20} /> Dashboard
          </C.MenuItem>
        )}
        {temPermissao('Tela de Produtos', 'GET') && (
          <C.MenuItem onClick={() => navigate("/produtos")} isActive={isActive("/produtos")}>
            <Box size={20} /> Produtos
          </C.MenuItem>
        )}
        {temPermissao('Tela de Fornecedores', 'GET') && (
          <C.MenuItem onClick={() => navigate("/fornecedores")} isActive={isActive("/fornecedores")}>
            <Users size={20} /> Fornecedores
          </C.MenuItem>
        )}
        {temPermissao('Tela de Clientes', 'GET') && (
          <C.MenuItem onClick={() => navigate("/clientes")} isActive={isActive("/clientes")}>
            <Users size={20} /> Clientes
          </C.MenuItem>
        )}
        {temPermissao('Tela de Recarga', 'GET') && (
          <C.MenuItem onClick={() => navigate("/recarga")} isActive={isActive("/recarga")}>
            <DollarSign size={20} /> Recarga
          </C.MenuItem>
        )}
        {temPermissao('Tela de Vendas', 'GET') && (
          <C.MenuItem onClick={() => navigate("/vendas")} isActive={isActive("/vendas")}>
            <ShoppingCart size={20} /> Vendas
          </C.MenuItem>
        )}
        {temPermissao('Tela de Pagamentos', 'GET') && (
          <C.MenuItem onClick={() => navigate("/pagamentos")} isActive={isActive("/pagamentos")}>
            <Banknote size={20} /> Pagamentos
          </C.MenuItem>
        )}
        {temPermissao('Tela de Relatórios', 'GET') && (
          <C.MenuItem onClick={() => navigate("/relatorios")} isActive={isActive("/relatorios")}>
            <FileText size={20} /> Relatórios
          </C.MenuItem>
        )}
        {temPermissao('Tela Usuarios', 'GET') && (
          <C.MenuItem onClick={() => navigate("/usuarios")} isActive={isActive("/usuarios")}>
            <User size={20} /> Usuários
          </C.MenuItem>
        )}
        {temPermissao('Tela de Entrada', 'GET') && (
          <C.MenuItem onClick={() => navigate("/entrada")} isActive={isActive("/entrada")}>
            <ArrowRightCircle size={20} /> Entrada
          </C.MenuItem>
        )}
        {temPermissao('Tela de Saída', 'GET') && (
          <C.MenuItem onClick={() => navigate("/saida")} isActive={isActive("/saida")}>
            <ArrowRightCircle size={20} /> Saída
          </C.MenuItem>
        )}
        <C.MenuItem onClick={logout}>
          <LogOut size={20} /> Logout
        </C.MenuItem>
      </C.Menu>

      <C.UserInfo>
        {usuario ? (
          <>
            <C.UserName>{usuario.name}</C.UserName>
            <C.UserEmail>{usuario.email}</C.UserEmail>
          </>
        ) : (
          <p>Carregando usuário...</p>
        )}
      </C.UserInfo>
    </C.SidebarContainer>
  );
};

export default Sidebar;
