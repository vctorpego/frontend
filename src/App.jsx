import React from "react";
import GlobalStyle from "./global.css";
import RoutesApp from "./routes";
import { AuthProvider } from "./contexts/auth";


export function App() {
    return (
        <AuthProvider>
            <RoutesApp />
            <GlobalStyle />
        </AuthProvider>
    );
}
