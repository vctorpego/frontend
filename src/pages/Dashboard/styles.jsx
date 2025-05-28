import styled from "styled-components";

export const Container = styled.div`
  padding: 2rem;
  background-color: #f5f5f5;
  min-height: 100vh;
`;

export const Title = styled.h2`
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
`;

export const ChartsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: space-between;

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: center;
  }
`;

export const ChartBox = styled.div`
  flex: 1 1 30%;
  min-width: 280px;
  height: 300px;
  background-color: #fff;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);

  h4 {
    font-size: 1.1rem;
    color: #444;
    margin-bottom: 1rem;
    text-align: center;
  }
`;
