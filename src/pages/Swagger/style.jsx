import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  height: 100vh; /* ocupa a tela toda */
`;

export const Content = styled.div`
  flex: 1; /* ocupa todo o espaço restante */
  padding: 20px;
  overflow: auto;

  /* Para garantir que o Swagger ocupe a altura total */
  & > div {
    height: 100%;
  }
`;
