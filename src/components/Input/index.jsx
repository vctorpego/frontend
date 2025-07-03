import React, { forwardRef } from "react";
import * as C from "./styles";

const Input = forwardRef(({ type, placeholder, value, onChange }, ref) => {
  return (
    <C.Input
      ref={ref} 
      value={value}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
    />
  );
});

export default Input;