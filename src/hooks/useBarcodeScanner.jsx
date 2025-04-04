import { useState, useEffect } from "react";

function useBarcodeScanner(onScan) {
  const [barcode, setBarcode] = useState("");

  useEffect(() => {
    const handleKeyPress = (event) => {
      const tagName = document.activeElement.tagName;
      const isTyping = tagName === "INPUT" || tagName === "TEXTAREA";

      if (isTyping) return;

      if (event.key === "Enter") {
        if (barcode) {
          onScan(barcode);
          setBarcode(""); // Limpa após escanear
        }
      } else {
        setBarcode((prev) => prev + event.key);
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [barcode, onScan]);

  return barcode;
}

export default useBarcodeScanner;
