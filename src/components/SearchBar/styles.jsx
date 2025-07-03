import styled from "styled-components";
import { Search } from "lucide-react";

export const InputWrapper = styled.div`
  width: 100%;
  height: 2.5rem;
  border: 1px solid #ccc;        
  border-radius: 10px;
  padding: 0 15px;
  box-shadow: 0px 0px 8px #ddd;
  background-color: white;
  display: flex;
  align-items: center;

  transition: border-color 0.3s ease;

  &:focus-within {
    border-color: #007bff;       
    box-shadow: 0 0 8px rgba(0, 123, 255, 0.25);

    svg {
      color: #007bff;
    }
  }
`;

export const SearchIcon = styled(Search)`
  color: #7a7a7a;
  font-size: 20px;
  margin-right: 2px;
`;
  
export const Input = styled.input`
  background-color: transparent;
  border: none;
  height: 100%;
  font-size: 1.25rem;
  width: 100%;
  
  &:focus {
    outline: none;
  }
`;
