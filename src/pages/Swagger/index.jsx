import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SwaggerUI from 'swagger-ui-react';
import jwt_decode from 'jwt-decode';
import 'swagger-ui-react/swagger-ui.css';

import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  height: 100vh; /* ocupa a tela toda */
`;

const Content = styled.div`
  flex: 1; /* ocupa todo o espaço restante */
  padding: 20px;
  overflow: auto;

  /* Para garantir que o Swagger ocupe a altura total */
  & > div {
    height: 100%;
  }
`;

const SwaggerPage = () => {
  const navigate = useNavigate();
  const [isTokenValid, setIsTokenValid] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate("/auth/login");
        return;
      }

      const decoded = jwt_decode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        console.warn("Token expirado. Redirecionando para login...");
        localStorage.removeItem("token");
        navigate("/auth/login");
      }
    } catch (error) {
      console.error("Erro ao verificar o token: ", error);
      navigate("/auth/login");
    }
  }, [navigate]);

  if (!isTokenValid) {
    return null;
  }

  return (
    <Container>

      <Content>
        <SwaggerUI
          url="http://localhost:8080/v3/api-docs"
          requestInterceptor={(request) => {
            const token = localStorage.getItem('token');
            if (token) {
              request.headers['Authorization'] = `Bearer ${token}`;
            }
            return request;
          }}
        />
      </Content>
    </Container>
  );
};

export default SwaggerPage;
