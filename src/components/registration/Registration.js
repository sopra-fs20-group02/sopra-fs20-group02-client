import React from 'react';
import { api, handleError } from '../../helpers/api';
import User from '../shared/models/User';
import { withRouter } from 'react-router-dom';
import { Grid, Header, Form, Button } from 'semantic-ui-react';
import {
    headerStyle, buttonStyle, background, hideUnhideStyle, title, statsTextStyle, LoginButtonStyle, LoginFooterStyle
} from "../../data/styles";
import Icon from "semantic-ui-react/dist/commonjs/elements/Icon";


class Registration extends React.Component {
    constructor() {
        super();
        this.state = {
            username: null,
            name: null,
            password: null,
            fields: ['username', 'password'],
            passwordField: 'password'
        };
        this.showHide = this.showHide.bind(this);
    }

    // registering the user
    async registration() {
        try {
            const requestBody = JSON.stringify({
                username: this.state.username,
                password: this.state.password
            });
            console.log(requestBody);
            const response = await api.post('/users', requestBody);

            this.props.history.push(`/login`);
        } catch (error) {
            if(error.response.status === 409){
                alert(error.response.data);
            }
            else {
                alert(`Something went wrong during the registration: \n${handleError(error)}`);
            }
        }
    }

    // handle changes to input fields
    handleInputChange(key, value) {
        this.setState({ [key]: value });
    }

    // showing and hiding the password
    showHide(e){
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            passwordField: this.state.passwordField === 'password' ? 'show' : 'password'
        })
    }

    componentDidMount() {}

    render() {
        return (
            <div style={background}>
                <Grid centered>
                    <Grid.Row>
                        <Header style={headerStyle}>
                            <h1 style={title}>Jess</h1>
                            <h3>Register</h3>
                        </Header>
                    </Grid.Row>
                    {this.state.fields.map((field) => (
                            <Grid.Row>
                                <Grid.Column style={{width:'300px', margin:'auto'}}>
                                    <Form inverted
                                          onChange={e => {this.handleInputChange(field, e.target.value);}}
                                    >
                                        <Form.Input>
                                            <input
                                                type={field === 'password' ? this.state.passwordField : ''}
                                                className="password__show"
                                                style={{maxWidth:'300px'}}
                                                onKeyPress = {e => {
                                                    if (e.key === 'Enter' && field === 'password' &&
                                                        this.state.username && this.state.password) {
                                                        this.registration();
                                                    }
                                                }}
                                                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                            />
                                            {field === 'password' ?
                                                <span
                                                    className="password__show"
                                                    onClick={this.showHide}
                                                >
                                                    <Icon
                                                        style={hideUnhideStyle}
                                                        name={this.state.passwordField === 'password'  ? 'hide' : 'unhide'}
                                                    />
                                                </span> : <span><Icon/></span>
                                            }
                                        </Form.Input>
                                    </Form>
                                </Grid.Column>
                            </Grid.Row>
                        )
                    )}
                    <Grid.Row>
                        {(this.state.username && this.state.password) && (
                            <Button inverted onClick={() => {
                                this.registration();
                            }} style={LoginButtonStyle}>
                                Register
                            </Button>
                        )}
                        {(!this.state.username || !this.state.password) && (
                            <Button inverted disabled onClick={() => {
                                this.registration();
                            }} style={LoginButtonStyle}>
                                Register
                            </Button>
                        )}
                    </Grid.Row>
                    <Grid.Row>
                        <h4 style={statsTextStyle}>
                            Back to <a style={{color:'#ff5e00', fontStyle:'italic'}} onClick={() => {
                            this.props.history.push('/login');
                        }}>Login</a>
                        </h4>
                    </Grid.Row>
                </Grid>
                <div as='h3' style={LoginFooterStyle}>
                    Made by SoPra-FS20-Group02
                </div>
            </div>
        );
    }
}

export default withRouter(Registration);
