import styled from "styled-components";

export const Container = styled.div`
  padding: 2rem;
  background-color: #f5f5f5;
  min-height: 100vh;
`;

/*
comentario
*/

export const Title = styled.h2`
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
`;

export const ChartsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 2rem;
`;

/*
comentario
*/

export const ChartBox = styled.div`
  width: 100%;
  max-width: 700px;
  height: 350px;
  background-color: #fff;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  h4 {
    font-size: 1.1rem;
    color: #444;
    margin-bottom: 1rem;
    text-align: center;
  }
`;
