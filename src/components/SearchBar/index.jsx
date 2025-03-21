import React from "react";
import { Search } from "lucide-react";
import Input from "../../components/Input";
import * as C from "./styles";

const SearchBar = ({ input, setInput }) => {
  return (
    <C.InputWrapper>
      <Search id="search-icon" />
      <Input
        type="text"
        placeholder="Pesquise por nome"
        value={input}
        onChange={(e) => setInput(e.target.value)} // Atualiza o estado do input no componente pai
      />
    </C.InputWrapper>
  );
};

export default SearchBar;