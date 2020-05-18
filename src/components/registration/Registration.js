import React from 'react';
import { api, handleError } from '../../helpers/api';
import User from '../shared/models/User';
import { withRouter } from 'react-router-dom';
import { Grid, Header, Form, Button } from 'semantic-ui-react';
import {
    headerStyle, buttonStyle, background
} from "../../data/styles";


class Registration extends React.Component {
    constructor() {
        super();
        this.state = {
            username: null,
            name: null,
            password: null,
            fields: ['username', 'password']
        };
    }

    async registration() {
        try {
            const requestBody = JSON.stringify({
                username: this.state.username,
                password: this.state.password
            });
            const response = await api.post('/users', requestBody);

            // Get the returned user and update a new object.
            const user = new User(response.data);

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
                                                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                            />
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
