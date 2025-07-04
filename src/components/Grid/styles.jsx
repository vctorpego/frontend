import styled from "styled-components";

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const TableHeader = styled.th`
  background-color: #f4f4f4;
  padding: 12px 15px;
  text-align: left;
  font-weight: bold;
  color: #333;
  border: 1px solid #ddd;
  font-size: 14px;
`;

export const TableCell = styled.td`
  padding: 12px 15px;
  text-align: left;
  vertical-align: middle;
  border: 1px solid #ddd;
  font-size: 14px;
  color: #555;
`;

export const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin: 0 5px;

  &:hover {
    opacity: 0.8;
  }

  svg {
    font-size: 18px;
  }
`;
