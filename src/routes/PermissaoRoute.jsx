import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import api from "../services/api";

const PermissaoRoute = ({ children, tela }) => {
  const [autorizado, setAutorizado] = useState(null);

  useEffect(() => {
    const verificarPermissao = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setAutorizado(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const login = decoded?.sub;

        // 1. Buscar ID do usuário pelo login
        const usuarioResponse = await api.get(`/usuario/id/${login}`);
        const idUsuario = usuarioResponse.data;

        if (!idUsuario) {
          setAutorizado(false);
          return;
        }

        // 2. Buscar permissões pelas telas
        const permissoesResponse = await api.get(`/permissao/telas/${idUsuario}`);
        const permissoes = permissoesResponse.data;

        if (!permissoes || permissoes.length === 0) {
          setAutorizado(false);
          return;
        }

        // 3. Verificar se possui permissão para a tela específica
        const permissaoTela = permissoes.find(p => p.tela === tela);
        setAutorizado(!!permissaoTela);

      } catch (error) {
        setAutorizado(false);
      }
    };

    verificarPermissao();
  }, [tela]);

  if (autorizado === null) {
    return <div>Verificando permissões...</div>;
  }

  return autorizado ? children : <Navigate to="/nao-autorizado" replace />;
};

export default PermissaoRoute;
