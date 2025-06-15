import styled, { css } from "styled-components";

export const Container = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.h1`
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const InputGroup = styled.div`
  display: flex;
  gap: 20px;
  justify-content: space-between;
`;

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const Label = styled.label`
  font-size: 14px;
  margin-bottom: 8px;
  color: #555;
`;

export const Input = styled.input`
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.3s;

  &:focus {
    border-color: #007bff;
  }

  &::placeholder {
    color: #aaa;
  }
`;

export const Select = styled.select`
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.3s;

  &:focus {
    border-color: #007bff;
  }
`;

export const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

// 🆕 Adicionando os estilos para permissões
export const PermissoesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 10px;
`;

export const CheckboxContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 6px;
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #333;
`;

export const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;




export const Message = styled.div`
  width: 100%;
  max-width: 500px;
  padding: 15px 20px;
  border-radius: 5px;
  margin: 20px auto;
  font-size: 16px;
  text-align: center;

  ${({ type }) =>
    type === 'error' &&
    css`
      background-color: #f8d7da;
      color: #842029;
      border: 1px solid #f5c2c7;
    `}

  ${({ type }) =>
    type === 'success' &&
    css`
      background-color: #d1e7dd;
      color: #0f5132;
      border: 1px solid #badbcc;
    `}

  ${({ type }) =>
    type === 'info' &&
    css`
      background-color: #cff4fc;
      color: #055160;
      border: 1px solid #b6effb;
    `}
`;
