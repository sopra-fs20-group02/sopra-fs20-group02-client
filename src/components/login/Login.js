import React from 'react';
import { api, handleError } from '../../helpers/api';
import User from '../shared/models/User';
import { withRouter } from 'react-router-dom';
import { Grid, Header, Form, Button } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import {
  headerStyle, inputFieldStyle, gridStyle,
  formStyle, loginButtonStyle
} from "../../data/styles";

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      username: null,
      password: null,
      fields: ['username', 'password']
    };
  }

  async login() {
    try {
      const requestBody = JSON.stringify({
        username: this.state.username,
        password: this.state.password
      });
      const response = await api.put('/login',requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token into the local storage.
      localStorage.setItem('token', user.token);

      // Login successfully worked --> navigate to the route /game in the GameRouter
      this.props.history.push(`/game`);
    } catch (error) {
      if (error.response.status === 401){
        alert(error.response.data);
      }
      else {
        alert(`Something went wrong during the login: \n${handleError(error)}`);
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
              Login
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
            <Button
                disabled={!this.state.username || !this.state.password}
                onClick={() => {
                  this.login();
                }}
                style={loginButtonStyle}
            >
              Login
            </Button>
          </Grid.Row>
          <Grid.Row>
            <FormattedMessage id="switchToRegister" />
            <button
                style={{textDecoration: 'underline'}}
                onClick={() => {
                  this.props.history.push('/registration');;
                }}
            >
              Register
            </button>
          </Grid.Row>
        </Grid>
    );
  }
}

export default withRouter(Login);
