import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import jwtDecode from "jwt-decode";
import * as C from "./styles";
import {
  CupSoda, LayoutDashboard, Box, Users, ShoppingCart,
  DollarSign, FileText, User, ArrowRightCircle, LogOut, Banknote
} from "lucide-react";

const Sidebar = ({ handleLogout }) => {
  const [permissoes, setPermissoes] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

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
        console.error("Token não encontrado");
        setIsLoggedIn(false);
        setCarregando(false);
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        if (!decodedToken?.sub) {
          console.error("ID do usuário não encontrado no token");
          setIsLoggedIn(false);
          return;
        }

        const userId = decodedToken.sub;

        const responseUser = await axios.get(`http://localhost:8080/usuario/id/${userId}`);
        const user = responseUser.data;
        setUsuario(user);

        const responsePermissoes = await axios.get(`http://localhost:8080/permissao/telas/${user}`);
        setPermissoes(responsePermissoes.data);
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
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login", { replace: true });
  };

  if (!isLoggedIn) return null;

  if (carregando) {
    return (
      <C.SidebarContainer>
        <C.Logo>
          <CupSoda size={30} />
          <C.LogoText>TechMeal</C.LogoText>
        </C.Logo>
        <p style={{ padding: "1rem" }}>Carregando...</p>
      </C.SidebarContainer>
    );
  }

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
