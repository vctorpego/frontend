import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerPage = () => {
  try {
    return (
      <div style={{ height: '100vh' }}>
        <SwaggerUI
          url="http://localhost:8080/v3/api-docs"  // Endereço correto do Swagger Docs
          requestInterceptor={(request) => {
            const token = localStorage.getItem('token'); // Pega o token do localStorage
            if (token) {
              // Adiciona o token de autorização no cabeçalho
              request.headers['Authorization'] = `Bearer ${token}`;
            }
            return request;
          }}
        />
      </div>
    );
  } catch (error) {
    console.error("Erro ao carregar o Swagger UI: ", error);
    return <div>Erro ao carregar a interface Swagger. Tente novamente mais tarde.</div>;
  }
};

export default SwaggerPage;
