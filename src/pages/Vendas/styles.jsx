import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
  gap: 30px;
  padding: 20px;
`;

export const Title = styled.h2`
  font-size: 32px;
  color: #333;
  text-align: center;
`;

export const Description = styled.p`
  font-size: 18px;
  color: #555;
  text-align: center;
`;

export const Form = styled.form`
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Input = styled.input`
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #007BFF;
    outline: none;
    transform: scale(1.05);
  }
`;



export const ProductList = styled.ul`
  list-style-type: none;
  padding: 0;
  width: 100%;
  max-width: 500px;
`;

export const ProductItem = styled.li`
  background-color: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;

  &:hover {
    background-color: #f1f1f1;
  }
`;

export const ProductPrice = styled.span`
  font-weight: bold;
  color: #27ae60;
  font-size: 18px;
`;

export const Label = styled.label`
  font-size: 16px;
  color: #555;

  
`;

export const Button = styled.button`
  background-color: #007BFF;
  color: white;
  padding: 14px 20px;
  font-size: 18px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #0056b3;
    transform: scale(1.05);
  }

  &:not(:only-child) {
    width: auto;
    flex: 1;
  }
`;

export const FieldGroup = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  width: 100%;
  max-width: 500px;

  @media (min-width: 480px) {
    flex-direction: row;
    align-items: center;
  }
`;

export const ClienteNome = styled.p`
  font-size: 1.4rem;
  font-weight: bold;
  color: #1a1a1a;
  margin-top: 10px;
`;

export const ValorTotal = styled.p`
  font-size: 1.4rem;
  font-weight: bold;
  color: #1a1a1a;
  margin-top: 5px;
`;

export const SubTitle = styled.h3`
  font-size: 1rem;
  font-weight: bold;
  color: #555;
  margin-top: 20px;
`;




