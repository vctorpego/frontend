import { useEffect, useState, useRef } from "react";

function useCodeScanner(onCodeRead) {
    const bufferRef = useRef("");
  
    useEffect(() => {
      const handleKeyDown = (e) => {
        if (e.key === "Enter") {
          if (bufferRef.current.length > 0) {
            const data = bufferRef.current;
  
            // Lógica simples para distinguir o tipo:
            // Exemplo: se começa com "0002", é cartão, senão barcode
            const tipo = data.startsWith("000") ? "card" : "barcode";
  
            onCodeRead(data, tipo);
            bufferRef.current = "";
          }
        } else if (e.key.length === 1) {
          bufferRef.current += e.key;
        }
      };
  
      window.addEventListener("keydown", handleKeyDown);
  
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, [onCodeRead]);
  
    return null;
  }
  

export default useCodeScanner;
