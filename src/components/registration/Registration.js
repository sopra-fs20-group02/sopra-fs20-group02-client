import React from 'react';
import { api, handleError } from '../../helpers/api';
import User from '../shared/models/User';
import { withRouter } from 'react-router-dom';
import { Grid, Header, Form, Button } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import {
    headerStyle, inputFieldStyle, gridStyle,
    formStyle, registerButtonStyle
} from "../../data/styles";


class Registration extends React.Component {
    constructor() {
        super();
        this.state = {
            username: null,
            name: null,
            password: null,
            fields: ['username', 'name', 'password']
        };
    }

    async registration() {
        try {
            const requestBody = JSON.stringify({
                username: this.state.username,
                name: this.state.name,
                password: this.state.password
            });
            const response = await api.post('/users', requestBody);

            // Get the returned user and update a new object.
            const user = new User(response.data);

            // Login successfully worked --> navigate to the route /lobby in the GameRouter
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

    componentDidMount() {}

    render() {
        return (
            <Grid style={gridStyle} centered>
                <Grid.Row>
                    <Header style={headerStyle}>
                        Register
                    </Header>
                </Grid.Row>
                {this.state.fields.map((field) => (
                    <Grid.Row>
                        <Grid.Column width={12}>
                            <Form
                                style={formStyle}
                                onChange={e => {this.handleInputChange(field, e.target.value);}}
                            >
                                <Form.Input>
                                    <input
                                        style={inputFieldStyle}
                                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                    />
                                </Form.Input>
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                    )
                )}
                <Grid.Row>
                    {(this.state.username && this.state.name && this.state.password) && (
                        <Button
                            onClick={() => {
                                this.registration();
                            }}
                            style={registerButtonStyle}
                        >
                            Register
                        </Button>
                    )}
                </Grid.Row>
                <Grid.Row>
                    <FormattedMessage id="switchToLogin" />
                    <button
                        style={{textDecoration: 'underline'}}
                        onClick={() => {
                            this.props.history.push('/login');;
                        }}
                    >
                        Login
                    </button>
                </Grid.Row>
            </Grid>
        );
    }
}

export default withRouter(Registration);
