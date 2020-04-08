import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { IntlProvider } from 'react-intl';
import messages from "./data/messages.js";
import './index.css';

ReactDOM.render(
    <IntlProvider messages={messages}>
        <App/>
    </IntlProvider>,
    document.getElementById("root"));
