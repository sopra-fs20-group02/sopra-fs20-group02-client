import React, { Component } from "react";
import 'semantic-ui-css/semantic.min.css';
import { Widget } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import {getDomain} from "../../helpers/getDomain";
import io from 'socket.io-client';
import SockJS from 'sockjs-client';
import Stomp from 'stomp-websocket';

class Chat extends Component {
    componentDidMount() {
        try{

            const url = getDomain() + '/ws';
            this.sock = new SockJS(url);
            this.stompClient = Stomp.over(this.sock);
            this.stompClient.connect({}, (frame) => {

                console.log('Connected: ' + frame);
                this.stompClient.subscribe("/topic/public", function (greeting) {
                    console.log(JSON.parse(greeting.body).content);
                });
            });
        }
        catch (e) {
            console.error("Chat Error:" + e.toString());
        }

    }

    render() {
        if (localStorage.getItem("token")) {
            return (
                <Widget
                    title="Chat"
                    subtitle=""/>
            );
        }
        else{
            return (<div></div>);
        }

    }
}

export default Chat;
