import React from "react";
import { api, handleError } from '../../helpers/api';
import { withRouter } from 'react-router-dom';
import { Grid, List, Header} from "semantic-ui-react";
import {
  lobbyHeaderStyle,
  playersListStyle,
  userItemStyle,
  lobbyTextStyle,
  buttonStyle, backgroundStats
} from "../../data/styles";

class Lobby extends React.Component {
  constructor(props) {
    super(props);
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

  // creates game with user and chosen opponent
  async createGame(blitz) {
    try {
      const requestBody = JSON.stringify({
        userId: localStorage.getItem('userId'),
        gameMode: blitz ? 'BLITZ' : 'CLASSIC'
      });
      const response = await api.post('/games', requestBody);
      const game = response.data;
      this.navigateToGame(game)
    } catch (error) {
      alert(`Something went wrong while creating the game: \n${handleError(error)}`);
    }
  }

  // allows joining a random game
  async joinRandomGame(){
    try {
      const requestBody = JSON.stringify({
        userId: localStorage.getItem('userId')
      });
      const response = await api.put('/games', requestBody);
      const game = response.data;
      this.navigateToGame(game)
    } catch (error) {
      alert(`No games available`);
    }
  }

  // allows joining a specific game
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

  // allows joining a game in watch mode
  async watchGame(game){
    console.log(game);
    try {
      this.props.history.push({
        pathname: '/game/play',
        state: {
          gameId: game.gameId
        }
      })
    } catch (error) {
      alert(`Something went wrong while creating the game: \n${handleError(error)}`);
    }
  }

  // navigating to game page
  async navigateToGame(game){
    this.props.history.push({
      pathname: '/game/wait',
      state: {
        gameId: game.gameId
      }
    })
  }

  // get a list of active open games
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
        <div style={backgroundStats}>

          <Grid centered>
            <Grid.Row style={lobbyHeaderStyle}>
              <h1>Hi {localStorage.getItem('userName')} {localStorage.getItem('emoji')}</h1>
            </Grid.Row>
            <Grid.Row style={lobbyTextStyle}>
              <div>
                <button className="ui inverted button" style={buttonStyle} onClick={() => {
                  this.createGame(false);
                }}>
                  Classic
                </button>
                <button className="ui inverted button" style={buttonStyle} onClick={() => {
                  this.createGame(true);
                }}>
                  Blitz
                </button>
                <button className="ui inverted button" style={buttonStyle} onClick={() => {
                  this.joinRandomGame();
                }}>
                  Join
                </button>
              </div>
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
                          <div style={{margin: '5px'}}>
                            {game.playerWhite ? game.playerWhite.username : '-'}
                            {' vs. '}
                            {game.playerBlack ? game.playerBlack.username : '-'}
                          </div>
                          {(game.playerWhite === null || game.playerBlack === null) &&
                          <button className="small ui inverted button"  onClick={() => {
                            this.joinSpecificGame(game);
                          }}>play</button>

                          }
                          {game.gameStatus === "FULL" &&
                          <button className="small ui inverted button"  onClick={() => {
                            this.watchGame(game);
                          }}>watch</button>

                          }
                        </List.Item>
                        }
                      </div>
                  );

                })}
              </List>
            </Grid.Row>
          </Grid>
        </div>
    );
  }
}

export default withRouter(Lobby);
