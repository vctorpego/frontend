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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

        const logadoResponse = await api.get(
          `http://localhost:8080/usuario/${user}`,

        );
        setUsuario(logadoResponse.data);
        console.log(logadoResponse.data)

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
  }, [isLoggedIn]);  // Adiciona 'isLoggedIn' como dependência

  const logout = () => {
    signout();
    navigate("/", { replace: true });
  };

  if (carregando || !isLoggedIn) return null;

  return (
    <C.SidebarContainer>
      <C.Logo>
        <CupSoda size={30} />
        <C.LogoText>TechMeal</C.LogoText>
      </C.Logo>

      <C.Menu>
        {permissoes
          .filter(p => p.permissoes.includes("GET"))
          .map((p) => (
            <C.MenuItem
              key={p.urlTela}
              onClick={() => navigate(p.urlTela)}
              isActive={isActive(p.urlTela)}
            >
              {p.tela.replace("Tela de ", "").trim()}
            </C.MenuItem>
          ))}

        <C.MenuItem onClick={logout}>
          Logout
        </C.MenuItem>
      </C.Menu>

      <C.UserInfo>
        {usuario ? (
          <>
            <C.UserName>{usuario.nomeUsuario}</C.UserName>
            <C.UserEmail>{usuario.emailUsuario}</C.UserEmail>

          </>
        ) : (
          <p>Carregando usuário...</p>
        )}
      </C.UserInfo>
    </C.SidebarContainer>
  );
};

export default Sidebar;
