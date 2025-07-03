import styled, { css } from 'styled-components';

export const Container = styled.div`
  width: calc(100% - 200px);
  margin-left: 200px;
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

export const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin: 0;
`;

export const AddButtonWrapper = styled.div`
  width: 160px;

  button {
    width: 100%;
    font-size: 0.8rem;
    padding: 12px;
  }

  @media (max-width: 768px) {
    width: 120px;
  }
`;

export const Message = styled.div`
  width: 100%;
  max-width: 500px;
  padding: 15px 20px;
  border-radius: 5px;
  margin: 25px auto;
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
