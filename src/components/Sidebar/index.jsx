import React from "react";
import { CupSoda, LayoutDashboard , Box, Users, ShoppingCart, DollarSign, FileText, User, ArrowRightCircle, LogOut } from "lucide-react";
import * as C from "./styles";  // Importando os estilos

const Sidebar = ({ user, handleLogout }) => {
  return (
    <C.SidebarContainer>
      <C.Logo>
        <CupSoda size={30} />
        <C.LogoText>TechMeal</C.LogoText>
      </C.Logo>
      
      <C.Menu>
        <C.MenuItem> <LayoutDashboard  size={20} /> LayoutDashboard  </C.MenuItem>
        <C.MenuItem> <Box size={20} /> Produtos </C.MenuItem>
        <C.MenuItem> <Users size={20} /> Fornecedores </C.MenuItem>
        <C.MenuItem> <Users size={20} /> Clientes </C.MenuItem>
        <C.MenuItem> <ShoppingCart size={20} /> Recarga </C.MenuItem>
        <C.MenuItem> <DollarSign size={20} /> Vendas </C.MenuItem>
        <C.MenuItem> <DollarSign size={20} /> Pagamentos </C.MenuItem>
        <C.MenuItem> <FileText size={20} /> Relatórios </C.MenuItem>
        <C.MenuItem> <User size={20} /> Usuários </C.MenuItem>
        <C.MenuItem> <ArrowRightCircle size={20} /> Entrada </C.MenuItem>
        <C.MenuItem> <ArrowRightCircle size={20} /> Saída </C.MenuItem>
        <C.MenuItem onClick={handleLogout}> <LogOut size={20} /> Logout </C.MenuItem>
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
