import React from "react";
import { api, handleError } from '../../helpers/api';
import { withRouter } from 'react-router-dom';
import { Grid, List, Button, Header, Icon} from "semantic-ui-react";
import {
  lobbyStyle, playerButtonStyle, lobbyHeaderStyle, logoutIconStyle,
  lobbyFooterStyle, playersListStyle, userItemStyle, lobbyTextStyle
} from "../../data/styles";

class Lobby extends React.Component {
  constructor() {
    super();
    this.state = {
      users: null,
    };
  }

  componentDidMount() {
    this.getUsers()
  }

  // logs out user
  async logout() {
    try {
      const requestBody = JSON.stringify({
        userId: localStorage.getItem('userId')
      });
      const response = await api.put('/logout', requestBody);

    } catch(error) {
        alert(`Something went wrong during the logout: \n${handleError(error)}`);
    }
    localStorage.clear();
    this.props.history.push('/login');
  }

  // gets random quote
  async getRandomQuote() {
    try {
      const response = await api.get('https://quotes.rest/qod.json');
      const quote = response.data.contents.quotes[0].quote;
      localStorage.setItem('quote', quote);
    }
    catch(error) {
      alert(`Something went wrong during the quote fetching: \n${
          handleError(error)
      }`);
    }
  }

  // creates game with user and chosen opponent
  async createGame() {
    try {
      const requestBody = JSON.stringify({
        userId: localStorage.getItem('userId')
      });
      const response = await api.post('/games', requestBody);
      localStorage.setItem('game', JSON.stringify(response.data));
      this.setState({ game : response.data });
      return response.data;

    } catch (error) {
      alert(`Something went wrong while creating the game: \n${handleError(error)}`);
    }
  }

  async handlePlay() {
    const game = await this.createGame();
    let status = game.gameStatus;
    window.alert(status);
    if (status === 'FULL') {
      this.props.history.push('/game');
    } else {
      this.getRandomQuote();
      this.props.history.push('/waiting');
    }
  }

  async getUsers() {
    try {
      const response = await api.get('/users');
      this.setState({ users: response.data });
    } catch (error) {
      alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
    }
  }

  render() {
    return (
        <Grid style={lobbyStyle} centered>
          <Grid.Row>
          </Grid.Row>
          <Grid.Row style={lobbyHeaderStyle}>
            <Button
                onClick={() => {
                  this.handlePlay();
                }}
                style={playerButtonStyle}
            >
              Random Game
            </Button>
          </Grid.Row>
          <Header as='h3' style={lobbyTextStyle}>
            or choose an opponent:
          </Header>
          <Grid.Row>
            <List style={playersListStyle}>
              {this.state.users && this.state.users.map(user => {
                if (parseInt(localStorage.getItem('userId'), 10)!== user.userId) {
                  return (
                      <List.Item style={userItemStyle}>
                        <Button
                            onClick={() => {
                              this.handlePlay();
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
