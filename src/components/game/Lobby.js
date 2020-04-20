import React from 'react';
import { api, handleError } from '../../helpers/api';
import { withRouter } from 'react-router-dom';
import { Grid, List, Button, Header, Icon} from "semantic-ui-react";
import {
  lobbyStyle, playerButtonStyle, lobbyHeaderStyle, logoutIconStyle, lobbyFooterStyle
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
        userId: JSON.parse(localStorage.getItem('user')).userId
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
        userId: JSON.parse(localStorage.getItem('user')).userId
      });
      const response = await api.post('/games', requestBody);
      localStorage.setItem('game', JSON.stringify(response.data));
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

  async handlePlay() {
    this.getRandomQuote();
    this.createGame();
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
            <Button
                onClick={() => {
                  this.handlePlay();
                }}
                style={playerButtonStyle}
            >
              {'Join Game'}
            </Button>
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
