import React from "react";
import { api, handleError } from '../../helpers/api';
import { withRouter } from 'react-router-dom';
import { Grid, List, Button, Header, Icon} from "semantic-ui-react";
import {
  lobbyStyle, playerButtonStyle, lobbyHeaderStyle, logoutIconStyle,
  lobbyFooterStyle, playersListStyle, userItemStyle, lobbyTextStyle, controlButtonStyle, LobbyUserTextStyle
} from "../../data/styles";
import {fetchGameStatus} from "../requests/fetchGameStatus";

class Lobby extends React.Component {
  constructor() {
    super();
    this.state = {
      games: null,
    };
  }

  componentDidMount() {
    this.interval = setInterval(async () => {
      this.getGames()
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
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

  async watchGame(game){
    console.log(game);
    try {
      this.navigateToGame(game)
    } catch (error) {
      alert(`Something went wrong while creating the game: \n${handleError(error)}`);
    }
  }

  async navigateToGame(game){
    const status = game.gameStatus;
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
    console.log(this.state.games);
    return (
        <Grid style={lobbyStyle} centered>
          <Grid.Row>
          </Grid.Row>
          <Grid.Row style={lobbyHeaderStyle}>
            <Button
                onClick={() => {
                  this.createGame();
                }}
                style={controlButtonStyle}
            >
              Create game
            </Button>
            <Button
                onClick={() => {
                  this.joinRandomGame();
                }}
                style={controlButtonStyle}
            >
              Join random game
            </Button>
          </Grid.Row>
          <Header as='h3' style={lobbyTextStyle}>
            play or watch game:
          </Header>
          <Grid.Row>
            <List style={playersListStyle}>
              {this.state.games && this.state.games.map(game => {
                return (
                    <div>
                      { (game.gameStatus === "WAITING" || game.gameStatus === "FULL") &&
                      <List.Item style={userItemStyle}>
                        {game.playerWhite ? game.playerWhite.username : '-'}
                        {' vs. '}
                        {game.playerBlack ? game.playerBlack.username : '-'}
                        {(game.playerWhite == null || game.playerBlack == null) &&
                        <Button
                            onClick={() => {
                              this.joinSpecificGame(game);
                            }}
                            style={playerButtonStyle}
                        >
                          play
                        </Button>
                        }
                        <Button
                            onClick={() => {
                              this.watchGame(game);
                            }}
                            style={playerButtonStyle}
                        >
                          watch
                        </Button>
                      </List.Item>
                      }
                    </div>
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
