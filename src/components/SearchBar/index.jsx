import React, { useRef, useEffect } from "react";
import Input from "../../components/Input";
import * as C from "./styles";

const SearchBar = ({ input, setInput }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        inputRef.current &&
        document.activeElement !== inputRef.current &&
        event.key.length === 1
      ) {
        inputRef.current.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <C.InputWrapper>
      <C.SearchIcon id="search-icon" />
      <Input
        ref={inputRef}
        type="text"
        placeholder="Pesquisar..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
    </C.InputWrapper>
  );
};

export default SearchBar;
