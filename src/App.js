import React, { Component } from "react";
import AppRouter from "./components/shared/routers/AppRouter";
import 'semantic-ui-css/semantic.min.css';
import Chat from "./components/chat/Chat"
import 'react-chat-widget/lib/styles.css';
class App extends Component {

    render() {

    return (
        <div className="App">
          <AppRouter />
        </div>
    );
    }
}

export default App;
