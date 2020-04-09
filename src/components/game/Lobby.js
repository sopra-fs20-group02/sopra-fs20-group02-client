import React from 'react';
import { api, handleError } from '../../helpers/api';
import { withRouter } from 'react-router-dom';
import { Grid, List, Button, Header, Icon} from "semantic-ui-react";
import {
  lobbyStyle, playerButtonStyle, playersListStyle, userItemStyle,
  lobbyHeaderStyle, lobbySloganStyle, logoutIconStyle, lobbyFooterStyle
} from "../../data/styles";
import { FormattedMessage } from "react-intl";
import GameStatus from "./GameStatus";

class Lobby extends React.Component {
  constructor() {
    super();
    this.state = {
      users: null
    };
  }

  // logs out user
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

  getUserId() {
    let userId;
    for (const userData of Array(this.state.users.length).keys()) {
      if (this.state.users[userData].username === localStorage.getItem('user')) {
        userId = this.state.users[userData].id;
      }
    }
    return userId;
  }

  // creates game with user and chosen opponent
  async createGame(opponent) {
    localStorage.setItem('currentOpponent', opponent);
    const players = [localStorage.getItem('user'), opponent];

    try {

      const requestBody = JSON.stringify({
        token: localStorage.getItem("token")
      });
      const response = await api.post('/games', requestBody);

      const gameStatus = new GameStatus(response.data);
      localStorage.setItem('gameStatus', gameStatus);
      this.props.history.push('/game');

    } catch (error) {
      if(error.response.status === 409){
        alert(error.response.data);
      }
      else {
        alert(`Something went wrong while creating the game: \n${handleError(error)}`);
      }
    }
  }

  async componentDidMount() {
    try {
      const response = await api.get('/users');
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
            <List style={playersListStyle}>
              {this.state.users && this.state.users.map(user => {
                if (localStorage.getItem('user') != user.username) {
                  return (
                      <List.Item style={userItemStyle}>
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
          <Grid.Row style={lobbyFooterStyle} columns={2}>
            <Grid.Column textAlign='center'>
              <Icon
                  style={logoutIconStyle}
                  name='log out'
                  size='large'
                  color='#FF3377'
                  flipped='horizontally'
                  onClick={() => {
                    this.logout();
                  }}
              />
            </Grid.Column>
            <Grid.Column style={{alignContent: 'left'}}>
            <Icon
                style={{align: 'left', margin: '20px'}}
                name='user circle outline'
                size='large'
                color='#FF3377'
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
    );
  }
}

export default withRouter(Lobby);
