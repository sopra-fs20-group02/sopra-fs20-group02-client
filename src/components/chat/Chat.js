import React, { Component } from "react";
import 'semantic-ui-css/semantic.min.css';
import 'react-chat-widget/lib/styles.css';
import {getDomain} from "../../helpers/getDomain";
import SockJS from 'sockjs-client';
import Stomp from 'stomp-websocket';
import Icon from "semantic-ui-react/dist/commonjs/elements/Icon";
import { Button, Comment, Form, Header } from 'semantic-ui-react'
import { motion } from "framer-motion"

class Chat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            senders: [],
            collapsed: true
        };
        this.sendMessage = this.sendMessage.bind(this);
        this.toggleCollapse = this.toggleCollapse.bind(this);
    }

    componentDidMount() {
        try{
            const url = getDomain() + '/ws';
            this.sock = new SockJS(url);
            this.stompClient = Stomp.over(this.sock);
            this.stompClient.connect({}, (frame) => {

                console.log('Connected: ' + frame);
                this.stompClient.subscribe("/topic/public", (message) => {
                    const body = JSON.parse(message.body);

                    const tmpMessages = this.state.messages;
                    const tmpSenders = this.state.senders;

                    tmpMessages.push(body.content);
                    tmpSenders.push(body.sender);

                    this.setState({
                        messages: tmpMessages,
                        senders: tmpSenders,
                    });

                    const doc = document.getElementById("comment");

                    window.scrollTo(
                        0, doc.scrollHeight
                    )
                });
            });
        }
        catch (e) {
            console.error("Chat Error:" + e.toString());
        }
    }

    renderMessages(){
        let content = [];
        for (let i = 0; i < this.state.messages.length; i++){
            content.push(
                <Comment>
                    <Comment.Content>
                        <Comment.Author  style={{color: 'white'}} as='a'>{this.state.senders[i]}</Comment.Author>
                        <Comment.Text  style={{color: 'white'}}>{this.state.messages[i]}</Comment.Text >
                    </Comment.Content>
                </Comment>
            )
        }
        return content;
    }

    toggleCollapse(){
        console.log(this.state.collapsed)
        this.setState({
            collapsed : !this.state.collapsed
        })
    }

    sendMessage(){
        const chatMessage = {
            sender: localStorage.getItem('userName'),
            content: document.getElementById("comment").value,
            type: 'CHAT'
        };
        this.stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        document.getElementById("comment").value = '';
    }

    render() {
        const variants = {
            open: {  y: 0 },
            closed: {  y: "+30px" },
        }
        if (localStorage.getItem("token")) {
            return (
                <div>
                    <div style={{
                        maxWidth: '300px',
                        margin: '25px',
                        position: 'fixed',
                        scroll: 'fixed',
                        bottom: '90px',
                        right: '0',
                        zIndex: '24',
                        borderRadius: '3px',
                    }}>
                        <motion.div
                            animate={this.state.collapsed ? "open" : "closed"}
                            variants={variants}
                        >
                            <Button color='orange' circular size='large' icon floated='right' onClick={this.toggleCollapse}
                            >
                                <Icon name='chat' />
                            </Button>
                        </motion.div>

                    </div>

                    {
                        !this.state.collapsed &&
                        <Comment.Group minimal inverted style={{
                            maxWidth: '300px',
                            margin: '20px',
                            position: 'fixed',
                            scroll: 'fixed',
                            bottom: '90px',
                            right: '0',
                            zIndex: '20',
                            background: '#4b4b4b',
                            padding: '10px',
                            borderRadius: '3px',
                        }}>
                            <Header as='h3' inverted dividing>Chat</Header>
                            <div style ={{
                                maxHeight: '50vh',
                                overflowY: 'scroll',
                            }}>
                                {this.renderMessages()}
                            </div>

                            <Form reply inverted>
                                <Form.TextArea id="comment" style={{
                                    height: '50px'
                                }}/>
                                <Button icon labelPosition='left' inverted onClick={this.sendMessage} >
                                    <Icon name='paper plane' />
                                    Send
                                </Button>
                            </Form>
                        </Comment.Group>
                    }

                </div>
            );

        }
        else{
            return (<div></div>);
        }
    }
}

export default Chat;
