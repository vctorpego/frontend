import React from "react";
import styled from "styled-components";

// Estilos inspirados no padrão existente
const Container = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
`;

const Content = styled.div`
  text-align: center;
  background: #fff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 90%;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: bold;
  color: #e53935;  /* Tom vermelho para indicar erro */
  margin-bottom: 16px;
`;

const Message = styled.p`
  font-size: 18px;
  color: #555;
  margin-bottom: 24px;
`;

const Button = styled.button`
  background-color: #1976d2;
  color: #fff;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
  &:hover {
    background-color: #1565c0;
  }
`;

const NaoAutorizado = () => {
  const handleBack = () => window.history.back();

  return (
    <Container>
      <Content>
        <Title>Acesso Negado</Title>
        <Message>Você não tem permissão para acessar esta página.</Message>
        <Button onClick={handleBack}>Voltar</Button>
      </Content>
    </Container>
  );
};

export default NaoAutorizado;
