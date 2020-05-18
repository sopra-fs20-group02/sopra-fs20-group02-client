import React, { Component } from "react";
import 'semantic-ui-css/semantic.min.css';
import { Widget } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import {getDomain} from "../../helpers/getDomain";
import io from 'socket.io-client';
import SockJS from 'sockjs-client';
import Stomp from 'stomp-websocket';

class Chat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: null
        };
        this.sendMessage = this.sendMessage.bind(this);
        this.updateComment = this.updateComment.bind(this);
        this.messages = ["a", "b", "c"];
        this.senders = ["ad", "id", "ka"];
    }

    componentDidMount() {
        try{
            const url = getDomain() + '/ws';
            this.sock = new SockJS(url);
            this.stompClient = Stomp.over(this.sock);
            this.stompClient.connect({}, (frame) => {

                console.log('Connected: ' + frame);
                this.stompClient.subscribe("/topic/public", (message) => {
                    this.messages.push(JSON.parse(message.body).content);
                    this.senders.push(JSON.parse(message.body).sender);

                    console.log(this.messages);
                    console.log(this.senders);
                });
            });
        }
        catch (e) {
            console.error("Chat Error:" + e.toString());
        }
    }

    onMessageReceived () {

    }

    renderMessages(){
        let content = [];
        for (let i = 0; i < this.messages.length; i++){
            content.push(
                <div className="comment">
                    <div className="content">
                        <a className="author">{this.senders[i]}</a>
                        <div className="text">{this.messages[i]}</div>
                    </div>
                </div>
            )
        }
        return content;
    }

    sendMessage(){
        const chatMessage = {
            sender: localStorage.getItem('userName'),
            content: this.state.value,
            type: 'CHAT'
        };
        this.stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        this.setState({value: null});
        document.getElementById("comment").value = '';
        this.forceUpdate();
    }

    updateComment(data){
        this.setState({
            value: data
        });
        console.log(data);
    }

    render() {
        if (localStorage.getItem("token")) {
            return (
                /*<Widget
                    title="Chat"
                    subtitle=""
                handleNewUserMessage = {this.handleNewUserMessage}/>*/
                <div className="ui minimal comments"
                     style={{
                         maxWidth: '300px',
                         maxHeight: '60%',
                         overflowY: 'scroll',
                         margin: '20px',
                         position: 'fixed',
                         scroll: 'fixed',
                         bottom: '90px',
                         right: '0',
                         zIndex: '20',
                         background: '#7a7a7a'
                     }}>
                    <h3 className="ui dividing header">Chat</h3>
                    {this.renderMessages()}
                    <form className="ui reply form">
                        <div className="field" >
                            <textarea id="comment" value={this.state.value} onInput={e => {this.updateComment(e.target.value);}}/>
                        </div>
                        <div className="ui blue labeled submit icon button" onClick={this.sendMessage}>
                            <i className="icon edit"/> Add Reply
                        </div>
                    </form>
                </div>
            );

        }
        else{
            return (<div></div>);
        }

    }
}

export default Chat;
