import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  height: 100vh;
  background-color: #f9f9f9;
  padding: 40px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const Title = styled.h2`
  font-size: 32px;
  color: #333;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 15px;
  }
`;

export const Label = styled.label`
  font-size: 16px;
  color: #555;
  margin-right: 10px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

export const ErrorMessage = styled.p`
  color: #c0392b;
  font-size: 14px;
  margin-top: 10px;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

export const Card = styled.div`
  background-color: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 600px;
  margin-top: 20px;
  text-align: center;

  @media (max-width: 768px) {
    max-width: 100%;
    padding: 15px;
  }
`;

// Atualização do SaldoCard para layout flex com cores dinâmicas baseadas em saldo numérico
export const SaldoCard = styled.div`
  margin-top: 15px;
  padding: 15px;
  border-radius: 6px;
  background-color: ${({ saldo }) =>
    saldo < 0 ? '#f8d7da' : '#d4edda'};
  color: ${({ saldo }) =>
    saldo < 0 ? '#721c24' : '#155724'};
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

// Label do saldo, estilo para texto mais destacado
export const SaldoText = styled.span`
  font-size: 18px;
  font-weight: bold;
  color: #333;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

// Valor do saldo com cor condicional e negrito
export const SaldoValue = styled.span`
  font-size: 18px;
  color: ${({ saldo }) => (saldo < 0 ? '#721c24' : '#155724')};
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

export const ComandaInfo = styled(Card)`
  text-align: left;

  ul {
    margin-top: 10px;
    padding-left: 20px;
  }

  li {
    margin-bottom: 4px;
  }

  @media (max-width: 768px) {
    text-align: center;
    padding-left: 15px;
  }
`;

// Card para mensagem de erro com estilo e responsividade
export const ErrorCard = styled.div`
  background-color: #f8d7da;
  border-radius: 8px;
  padding: 20px;
  width: 80%;
  max-width: 400px;
  margin-top: 20px;
  text-align: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.08);

  @media (max-width: 768px) {
    width: 100%;
    padding: 15px;
  }
`;

export const ErrorText = styled.p`
  color: #721c24;
  font-size: 18px;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

// Card para Cartão e código do Cartão com textos na mesma linha
export const CartaoCard = styled(Card)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  width: 100%;
  max-width: 600px;
  margin-top: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 10px;
  }
`;

export const CartaoTexto = styled.div`
  display: flex;
  align-items: center;
`;

export const CartaoTextoLabel = styled(Label)`
  margin-right: 10px;
`;

export const CartaoCodigo = styled.div`
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
  color: #333;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

export const CartaoCodigoText = styled.p`
  font-weight: normal;
  margin-left: 5px;
  color: #555;
`;
