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
      games: null,
    };
  }

  componentDidMount() {
    this.getGames()
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

  // creates game with user and chosen opponent
  async createGame() {
    try {
      const requestBody = JSON.stringify({
        userId: localStorage.getItem('userId')
      });
      const response = await api.post('/games', requestBody);
      const game = response.data;
      this.navigateToGame(game)
    } catch (error) {
      alert(`Something went wrong while creating the game: \n${handleError(error)}`);
    }
  }

  async joinRandomGame(){
    try {
      const requestBody = JSON.stringify({
        userId: localStorage.getItem('userId')
      });
      const response = await api.put('/games', requestBody);
      const game = response.data;
      this.navigateToGame(game)
    } catch (error) {
      alert(`Something went wrong while creating the game: \n${handleError(error)}`);
    }
  }

  async joinSpecificGame(game){
    console.log(game);
    try {
      const requestBody = JSON.stringify({
        userId: localStorage.getItem('userId'),
        gameId: game.gameId
      });
      const response = await api.put('/games', requestBody);
      this.navigateToGame(game)
    } catch (error) {
      alert(`Something went wrong while creating the game: \n${handleError(error)}`);
    }
  }

  async navigateToGame(game){
    const status = game.gameStatus;
    /*if (status === 'FULL') {
      this.props.history.push('/game');
    } else {
      this.props.history.push({
          pathname: '/waiting',
          state: { gameId: game.gameId }
      });*/
    this.props.history.push({
      pathname: '/waiting',
      state: { gameId: game.gameId }
    })
  }

  async getGames() {
    try {
      const response = await api.get('/games');
      this.setState({ games: response.data });
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
                  this.createGame();
                }}
                style={playerButtonStyle}
            >
              Create random game
            </Button>
            <Button
                onClick={() => {
                  this.joinRandomGame();
                }}
                style={playerButtonStyle}
            >
              Join random game
            </Button>
          </Grid.Row>
          <Header as='h3' style={lobbyTextStyle}>
            or select an existing game:
          </Header>
          <Grid.Row>
            <List style={playersListStyle}>
              {this.state.games && this.state.games.map(game => {
                return (
                    <List.Item style={userItemStyle}>
                      <Button
                          onClick={() => {
                            this.joinSpecificGame(game);
                          }}
                          style={playerButtonStyle}
                      >
                        {game.gameId}
                      </Button>
                    </List.Item>
                );

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
