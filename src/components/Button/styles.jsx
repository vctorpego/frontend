import styled from "styled-components";

export const Button = styled.button`
  padding: 16px 20px;
  outline: none;
  border: none;
  border-radius: 8px;
  width: 100%;
  max-width: 350px;
  cursor: pointer;
  background-color: #046ee5;
  color: white;
  font-weight: 600;
  font-size: 16px;

  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #0357c0; /* cor um pouco mais escura */
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;
