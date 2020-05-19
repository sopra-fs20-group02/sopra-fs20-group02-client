import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import './index.css';

const meta = {
    name: "viewport",
    content: "width=device-width",
    initialScale: 1.0,
    maximumScale: 1.0,
    userScalable: 'no'
}

ReactDOM.render(
    <App {...meta} />,
    document.getElementById("root")
);
