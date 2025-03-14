import React from "react";
import RoutesApp from "./routes";
import { AuthProvider } from "./contexts/auth";
import GlobalStyle from "./styles/global";

export function App() {
    console.log("App está carregando!");
    return (
        <AuthProvider>
            <RoutesApp />
        </AuthProvider>
    );
}

