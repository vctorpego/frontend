import React from "react";

const ComandaPrint = React.forwardRef(({ comanda }, ref) => {
  if (!comanda) return null;

  return (
    <div ref={ref}>
      <h2>ID da Comanda: {comanda.idCompraComanda}</h2>
    </div>
  );
});

export default ComandaPrint;
