import styled from "styled-components";

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
`;

const CardBase = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 18px rgba(0,0,0,0.12);
    transform: translateY(-2px);
  }
`;

export const CartaoCard = styled(CardBase)`
  padding: 20px 30px;
  margin-bottom: 20px;
  max-width: 500px;
  width: 100%;
`;

export const Card = styled(CardBase)`
  padding: 24px;
  width: 100%;
  max-width: 500px;
  margin-top: 20px;
  text-align: center;

  h2, h3, h4 {
    color: #333;
    margin-bottom: 12px;
  }
`;

export const SaldoCard = styled(CardBase)`
  margin-top: 15px;
  padding: 15px;
  background-color: ${({ saldo }) => (saldo < 0 ? '#fdecea' : '#e8f5e9')};
  color: ${({ saldo }) => (saldo < 0 ? '#c62828' : '#2e7d32')};
  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
    font-weight: bold;
  }
`;

export const Message = styled.p`
  text-align: center;
  background: ${({ erro }) => (erro ? "#fdecea" : "#e8f5e9")};
  color: ${({ erro }) => (erro ? "#b91c1c" : "#047857")};
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-weight: 600;
  font-size: 1rem;
`;

export const ComandaInfo = styled(CardBase)`
  padding: 24px;
  width: 100%;
  max-width: 500px;
  margin-top: 20px;
  text-align: left;

  h3 {
    color: #333;
    margin-bottom: 15px;
  }

  p {
    margin-bottom: 8px;
    color: #555;
  }

  ul {
    margin-top: 10px;
    padding-left: 20px;
  }

  li {
    margin-bottom: 6px;
    color: #555;
  }

  @media (max-width: 768px) {
    text-align: center;
    padding: 15px;
  }
`;

export const CartaoTexto = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const CartaoTextoLabel = styled.label`
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

export const CartaoCodigo = styled.div``;

export const CartaoCodigoText = styled.span`
  font-size: 16px;
  color: #34495e;
`;

export const SaldoText = styled.span`
  font-size: 16px;
  font-weight: bold;
  color: #2c3e50;
`;

export const SaldoValue = styled.span`
  font-size: 16px;
  font-weight: bold;
  color: ${({ saldo }) => (saldo < 0 ? "#b91c1c" : "#047857")};
`;
