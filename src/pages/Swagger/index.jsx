import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SwaggerUI from 'swagger-ui-react';
import jwt_decode from 'jwt-decode';
import 'swagger-ui-react/swagger-ui.css';

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
    <div style={{ height: '100vh' }}>
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
    </div>
  );
};

export default SwaggerPage;
