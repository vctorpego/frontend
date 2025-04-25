import styled from 'styled-components';

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

export const Label = styled.label`
  font-size: 16px;
  color: #555;
`;

export const CancelButton = styled(Button)`
  background-color: #dc3545;

  &:hover {
    background-color: #c82333;
  }
`;