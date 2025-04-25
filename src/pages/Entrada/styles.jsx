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
  background-color: #f8d7da;
  color: #721c24;
  font-size: 16px;
  padding: 12px 20px;
  border-radius: 8px;
  margin-top: 20px;
  text-align: center;
  max-width: 500px;
  width: 100%;
`;

// Card com texto de boas-vindas
export const WelcomeCard = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  margin-top: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  max-width: 500px;
  width: 100%;

  h2 {
    color: #333;
    font-size: 24px;
    margin-bottom: 10px;

    @media (max-width: 768px) {
      font-size: 20px;
    }
  }
`;

export const CartaoCard = styled.div`
  background-color: #fff;
  padding: 20px 30px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 20px;
  max-width: 500px;
  width: 100%;
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
  font-size: 18px;
  font-weight: bold;
  color: #333;
`;

export const CartaoCodigo = styled.div`
  padding: 0; /* sem padding nem fundo */
`;

export const CartaoCodigoText = styled.span`
  font-size: 18px;
  font-weight: bold;
  color: #000; /* preto padrão */
`;

export const SaldoCard = styled.div`
  background-color: ${({ saldo }) => (saldo < 0 ? '#f8d7da' : '#d4edda')};
  padding: 15px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const SaldoText = styled.span`
  font-size: 18px;
  color: #333;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

export const SaldoValue = styled.span`
  font-size: 18px;
  color: ${({ children }) => (parseFloat(children) < 0 ? '#721c24' : '#155724')};
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;
