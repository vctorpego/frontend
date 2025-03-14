import { useContext } from "react";
import { AuthContext } from "../contexts/auth";  // Certifique-se de que o caminho está correto

const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
};

export default useAuth;
