import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  height: 100vh;
`;

export const Content = styled.div`
  margin-left: 250px;
  padding: 20px;
  width: 100%;
  overflow: auto;
`;

export const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 30px;
`;

export const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

export const Card = styled.div`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 30px 20px;
  text-align: center;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  span {
    display: block;
    margin-top: 12px;
    font-size: 16px;
    font-weight: 500;
    color: #444;
  }
`;
