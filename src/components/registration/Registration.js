import React from 'react';
import { api, handleError } from '../../helpers/api';
import User from '../shared/models/User';
import { withRouter } from 'react-router-dom';
import { Grid, Header, Form, Button } from 'semantic-ui-react';
import {
    headerStyle, buttonStyle, background, hideUnhideStyle
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
            passwordField: 'show'
        };
        this.showHide = this.showHide.bind(this);
    }

    async registration() {
        try {
            const requestBody = JSON.stringify({
                username: this.state.username,
                password: this.state.password
            });
            const response = await api.post('/users', requestBody);

            // Get the returned user and update a new object.
            //const user = new User(response.data);

            // Login successfully worked --> navigate to /login
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

    handleInputChange(key, value) {
        this.setState({ [key]: value });
    }

    showHide(e){
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            passwordField: this.state.passwordField === 'show' ? 'password' : 'show'
        })
    }

    componentDidMount() {}

    render() {
        return (
            <div style={background}>
                <Grid centered>
                    <Grid.Row>
                        <Header style={headerStyle}>
                            Register
                        </Header>
                    </Grid.Row>
                    {this.state.fields.map((field) => (
                            <Grid.Row>
                                <Grid.Column width={8} height={0}>
                                    <Form inverted
                                          onChange={e => {this.handleInputChange(field, e.target.value);}}
                                    >
                                        <Form.Input>
                                            <input
                                                type={field === 'password' ? this.state.passwordField : ''}
                                                className="password__show"
                                                onKeyPress = {e => {
                                                    if (e.key === 'Enter' && field === 'password' &&
                                                        this.state.username && this.state.password) {
                                                        this.registration();
                                                    }
                                                }}
                                                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                            />
                                            {(field === 'password') &&
                                                <span
                                                    className="password__show"
                                                    onClick={this.showHide}
                                                >
                                                    <Icon
                                                        style={hideUnhideStyle}
                                                        name={this.state.passwordField === 'show'  ? 'hide' : 'unhide'}
                                                    />
                                                </span>
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
                            }} style={buttonStyle}>
                                Register
                            </Button>
                        )}
                        {(!this.state.username || !this.state.password) && (
                            <Button inverted disabled onClick={() => {
                                this.registration();
                            }} style={buttonStyle}>
                                Register
                            </Button>
                        )}
                        <Button inverted onClick={() => {
                            this.props.history.push('/login');
                        }} style={buttonStyle}>
                            Login
                        </Button>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}

export default withRouter(Registration);
