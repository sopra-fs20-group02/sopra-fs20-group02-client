import React from 'react';
import { api, handleError } from '../../helpers/api';
import { withRouter } from 'react-router-dom';
import { Grid, List, Button, Header, Icon} from "semantic-ui-react";
import {
  lobbyStyle, playerButtonStyle,
  lobbyHeaderStyle, lobbySloganStyle
} from "../../data/styles";
import { FormattedMessage } from "react-intl";

class Lobby extends React.Component {
  constructor() {
    super();
    this.state = {
      users: null
    };
  }

  openProfile(id){
    this.props.history.push(`/lobby/profile/${id}`);
  }

  async logout() {
    try {
      const requestBody = JSON.stringify({
        token: localStorage.getItem("token")
      });
      const response = await api.put('/logout', requestBody);

    } catch(error) {
      if(error.response.status === 404) {
        alert(error.response.data);
      }
      else {
        alert(`Something went wrong during the logout: \n${handleError(error)}`);
      }
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.props.history.push('/login');
  }

  // this
  async createGame(opponent) {
    localStorage.setItem('currentOpponent', opponent);
    // TODO: this function should create a game by sending a request with the two following players:
    const players = [localStorage.getItem('user'), opponent];
    window.alert(players);
    this.props.history.push('/game');
  }

  async componentDidMount() {
    try {
      const response = await api.get('/users');

      // Get the returned users and update the state.
      this.setState({ users: response.data });

      console.log(response);
    } catch (error) {
      alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
    }
  }

  render() {
    return (
      <Grid style={lobbyStyle} centered>
        <Grid.Row>
          <Header as='h1' style={lobbyHeaderStyle}>
            Play
          </Header>
        </Grid.Row>
        <Grid.Row>
          <Header as='h3' style ={lobbySloganStyle}>
            <FormattedMessage id="opponentsHeader" />
          </Header>
        </Grid.Row>
        <Grid.Row>
          <List style={{width: '100%'}}>
            {this.state.users && this.state.users.map(user => {
              if (localStorage.getItem('user') != user.username) {
                return (
                    <List.Item style={{ color: "black" }}>
                      <Button
                          onClick={() => {
                            this.createGame(user.username);
                          }}
                          style={playerButtonStyle}
                      >
                        {user.username}
                      </Button>
                    </List.Item>
                );
              }
            })}
          </List>
        </Grid.Row>
        <Grid.Row style={{alignContent: 'center', align: 'center', background: 'white', height: '100%'}}>
          <Grid.Column style={{alignContent: 'center'}}>
            <Icon
                style={{align: 'center', margin: '20px'}}
                name='log out'
                size='large'
                color='#FF3377'
                flipped='horizontally'
                onClick={() => {
                  this.logout();
                }}
            />
          </Grid.Column>
          {/* <Grid.Column style={{alignContent: 'left'}}>
            <Icon
                style={{align: 'left', margin: '20px'}}
                name='user circle outline'
                size='large'
                color='#FF3377'
                onClick={() => {
                  this.openProfile();
                }}
            />
          </Grid.Column> */}
        </Grid.Row>
      </Grid>
    );
  }
}

export default withRouter(Lobby);
