import React from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Importando o hook useLocation para saber a URL atual
import { CupSoda, LayoutDashboard, Box, Users, ShoppingCart, DollarSign, FileText, User, ArrowRightCircle, LogOut, Banknote } from "lucide-react";
import * as C from "./styles";  // Importando os estilos

const Sidebar = ({ user, handleLogout }) => {
  const navigate = useNavigate(); // Usando o hook useNavigate para navegação programática
  const location = useLocation(); // Obtendo a localização atual (caminho da página)

  const handleNavigation = (path) => {
    navigate(path); // Redireciona para a página com o caminho fornecido
  };

  // Função para verificar se o item de menu corresponde à página atual
  const isActive = (path) => location.pathname === path;

  return (
    <C.SidebarContainer>
      <C.Logo>
        <CupSoda size={30} />
        <C.LogoText>TechMeal</C.LogoText>
      </C.Logo>

      <C.Menu>
        <C.MenuItem onClick={() => handleNavigation("")} isActive={isActive("/home")}>
          <LayoutDashboard size={20} /> Dashboard
        </C.MenuItem>
        <C.MenuItem onClick={() => handleNavigation("/produtos")} isActive={isActive("/produtos")}>
          <Box size={20} /> Produtos
        </C.MenuItem>
        <C.MenuItem onClick={() => handleNavigation("/fornecedores")} isActive={isActive("/fornecedores")}>
          <Users size={20} /> Fornecedores
        </C.MenuItem>
        <C.MenuItem onClick={() => handleNavigation("/clientes")} isActive={isActive("/clientes")}>
          <Users size={20} /> Clientes
        </C.MenuItem>
        <C.MenuItem onClick={() => handleNavigation("/recarga")} isActive={isActive("/recarga")}>
          <DollarSign size={20} /> Recarga
        </C.MenuItem>
        <C.MenuItem onClick={() => handleNavigation("/vendas")} isActive={isActive("/vendas")}>
          <ShoppingCart size={20} /> Vendas
        </C.MenuItem>
        <C.MenuItem onClick={() => handleNavigation("/pagamentos")} isActive={isActive("/pagamentos")}>
          <Banknote size={20} /> Pagamentos
        </C.MenuItem>
        <C.MenuItem onClick={() => handleNavigation("")} isActive={isActive("/relatorios")}>
          <FileText size={20} /> Relatórios
        </C.MenuItem>
        <C.MenuItem onClick={() => handleNavigation("")} isActive={isActive("/usuarios")}>
          <User size={20} /> Usuários
        </C.MenuItem>
        <C.MenuItem onClick={() => handleNavigation("/entrada")} isActive={isActive("/entrada")}>
          <ArrowRightCircle size={20} /> Entrada
        </C.MenuItem>
        <C.MenuItem onClick={() => handleNavigation("/saida")} isActive={isActive("/saida")}>
          <ArrowRightCircle size={20} /> Saída
        </C.MenuItem>
        <C.MenuItem onClick={handleLogout}>
          <LogOut size={20} /> Logout
        </C.MenuItem>
      </C.Menu>

      <C.UserInfo>
        {user ? (
          <>
            <C.UserName>{user.name}</C.UserName>
            <C.UserEmail>{user.email}</C.UserEmail>
          </>
        ) : (
          <p>Carregando...</p>
        )}
      </C.UserInfo>
    </C.SidebarContainer>
  );
};

export default Sidebar;
