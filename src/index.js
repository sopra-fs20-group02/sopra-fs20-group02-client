import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { IntlProvider } from 'react-intl';
import messages from "./data/messages.js";
import './index.css';

const meta = {
    name: "viewport",
    content: "width=device-width",
    initialScale: 1.0,
    maximumScale: 1.0,
    userScalable: 'no'
}

ReactDOM.render(
    <IntlProvider messages={messages}>
        <App {...meta} />
    </IntlProvider>,
    document.getElementById("root")
);
