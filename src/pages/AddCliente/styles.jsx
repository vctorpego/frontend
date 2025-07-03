import styled, { css } from 'styled-components';

export const Container = styled.div`
  width: calc(100% - 200px);
  margin-left: 200px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  height: 100vh;
  background-color: #f4f4f4;
  padding: 40px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const Title = styled.h2`
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
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
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #007BFF;
    outline: none;
  }
`;

export const Button = styled.button`
  background-color: #007BFF;
  color: white;
  padding: 12px;
  font-size: 18px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

export const BackButton = styled.button`
  position: absolute;
  top: 40px;
  left: 220px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  color: #333;
  font-size: 16px;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #000;
  }

  @media (max-width: 768px) {
    position: static; 
    margin-bottom: 20px;
    align-self: flex-start;
  }
`;

export const Label = styled.label`
  font-size: 16px;
  color: #555;
`;

export const Message = styled.div`
  width: 100%;
  max-width: 500px;
  padding: 15px 20px;
  border-radius: 5px;
  margin-bottom: 20px;
  font-size: 16px;
  text-align: center;

  ${({ type }) => type === 'error' && css`
    background-color: #f8d7da;
    color: #842029;
    border: 1px solid #f5c2c7;
  `}

  ${({ type }) => type === 'success' && css`
    background-color: #d1e7dd;
    color: #0f5132;
    border: 1px solid #badbcc;
  `}

  ${({ type }) => type === 'info' && css`
    background-color: #cff4fc;
    color: #055160;
    border: 1px solid #b6effb;
  `}
`;