import React from 'react';
import { api, handleError } from '../../helpers/api';
import User from '../shared/models/User';
import { withRouter } from 'react-router-dom';
import { Grid, Header, Form, Button } from 'semantic-ui-react';
import {
  headerStyle, buttonStyle, background
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
    let user;

    try {
      const requestBody = JSON.stringify({
        username: this.state.username,
        password: this.state.password
      });
      const response = await api.put('/login',requestBody);

      // Get the returned user and update a new object.
      user = new User(response.data);

      // Store the token into the local storage.
      // TODO: test this again when 204 from /login is fixed
      localStorage.setItem('token', user.token);
      localStorage.setItem('userId', user.userId);

      // Login successfully worked --> navigate to the route /lobby in the GameRouter
      this.props.history.push({
          pathname: `/lobby/main`
      });
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
        <div style={background}>
          <Grid centered>
            <Grid.Row>
              <Header style={headerStyle}>
                Login
              </Header>
            </Grid.Row>
            {this.state.fields.map((field) => (
                    <Grid.Row>
                      <Grid.Column width={8}>
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
                    this.login();
                  }} style={buttonStyle}>
                    Login
                  </Button>

              )}
              {(!this.state.username || !this.state.password) && (
                  <Button inverted disabled onClick={() => {
                    this.login();
                  }} style={buttonStyle}>
                    Login
                  </Button>

              )}
              <Button inverted onClick={() => {
                this.props.history.push('/registration');
              }} style={buttonStyle}>
                Register
              </Button>
            </Grid.Row>
          </Grid>
        </div>
    );
  }
}

export default withRouter(Login);
