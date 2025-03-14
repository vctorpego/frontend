import { Fragment } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import useAuth from "../hooks/userAuth";

const Private = ({ Item }) => {
    const { signed } = useAuth();

    return signed > 0 ? <Item /> : <Login />;

};

const RoutesApp = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/home" element={<Private Item={Home} />} />
                <Route path="/" element={<Login />} />
                <Route path="*" element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
};

export default RoutesApp;