import styled from "styled-components";

export const InputWrapper = styled.div`
  width: 100%;
  height: 2.5rem;
  border: none;
  border-radius: 10px;
  padding: 0 15px;
  box-shadow: 0px 0px 8px #ddd;
  background-color: white;
  display: flex;
  align-items: center;
`;

export const SearchIcon = styled(Search)`
  color: royalblue;
  font-size: 20px;
  margin-right: 10px;
`;

export const Input = styled.input`
  background-color: transparent;
  border: none;
  height: 100%;
  font-size: 1.25rem;
  width: 100%;
  margin-left: 5px;
  
  &:focus {
    outline: none;
  }
`;
