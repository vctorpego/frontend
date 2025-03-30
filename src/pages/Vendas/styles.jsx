// src/pages/Vendas/styles.jsx
import styled from "styled-components";

// Exportação nomeada
export const Container = styled.div`
  font-family: Arial, sans-serif;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  background-color: #f4f4f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.h1`
  color: #333;
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 20px;
`;

export const Description = styled.p`
  font-size: 1.2rem;
  text-align: center;
  color: #555;
  margin-bottom: 30px;
`;

export const ProductList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

export const ProductItem = styled.li`
  background-color: #fff;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background-color: #f1f1f1;
  }
`;

export const ProductPrice = styled.span`
  font-weight: bold;
  color: #27ae60;
  font-size: 1.2rem;
`;
