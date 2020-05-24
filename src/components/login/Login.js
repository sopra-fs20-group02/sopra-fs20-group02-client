import React from 'react';
import { api, handleError } from '../../helpers/api';
import User from '../shared/models/User';
import { withRouter } from 'react-router-dom';
import {Grid, Header, Form, Button, Popup} from 'semantic-ui-react';
import {
  headerStyle, buttonStyle, background, hideUnhideStyle, title, statsTextStyle, LoginButtonStyle, LoginFooterStyle
} from "../../data/styles";
import Icon from "semantic-ui-react/dist/commonjs/elements/Icon";

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      username: null,
      password: null,
      emoji: null,
      fields: ['username', 'password'],
      passwordField: 'password'
    };
    this.showHide = this.showHide.bind(this);
  }

  // logs in user
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
      localStorage.setItem('userName', user.username);

      // Login successfully worked --> navigate to the route /lobby in the GameRouter
      this.props.history.push({
          pathname: `/lobby/main`
      });
      this.props.userStateCallback();
    } catch (error) {
      if (error.response.status === 401){
        alert(error.response.data);
      }
      else {
        alert(`Something went wrong during the login: \n${handleError(error)}`);
      }
    }
  }

  // handle changes to the input fields
  handleInputChange(key, value) {
      this.setState({ [key]: value });
  }

  // show or hide password
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
                <h3>Login</h3>
              </Header>
            </Grid.Row>
            {this.state.fields.map((field) => (
                    <Grid.Row>
                      <Grid.Column style={{width:'300px', margin:'auto'}}>
                        <Form inverted
                            onChange={
                                e => {this.handleInputChange(field, e.target.value)}
                            }
                              style={{right:'-10px'}}
                        >
                          <Form.Input>
                            <input
                                type={field === 'password' ? this.state.passwordField : ''}
                                className="password__show"
                                onKeyPress = {e => {
                                    if (e.key === 'Enter' && field === 'password' &&
                                        this.state.username && this.state.password) {
                                        this.login();
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
                    this.login();
                  }} style={LoginButtonStyle}>
                    Login
                  </Button>

              )}
              {(!this.state.username || !this.state.password) && (
                  <Button inverted disabled onClick={() => {
                    this.login();
                  }} style={LoginButtonStyle}>
                    Login
                  </Button>

              )}
            </Grid.Row>
            <Grid.Row>
              <h4 style={statsTextStyle}>
                Not registered yet? <a style={{color:'#ff5e00', fontStyle:'italic'}} onClick={() => {
                this.props.history.push('/registration');
              }}>Register</a>
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

export default withRouter(Login);
