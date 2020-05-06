import React from "react";
import { withRouter } from 'react-router-dom';
import { Grid, List, Header, Icon} from "semantic-ui-react";
import {
  gamesStatsStyle, gamesStatsHeaderStyle, logoutIconStyle,
  gamesStatsFooterStyle, statsListStyle, statsItemStyle,
  statsTextStyle, statsStyle, statsHeaderStyle, background
} from "../../data/styles";
import {api, handleError} from "../../helpers/api";
import Footer from "../game/Footer";

class GamesStats extends React.Component {
  constructor() {
    super();
    this.state = {
      gamesStats: null,
    };
  }

  // logs out user
  async logout() {
    try {
      const requestBody = JSON.stringify({
        userId: localStorage.getItem('userId')
      });
      const response = await api.put('/logout', requestBody);

    } catch(error) {
      console.log(`Something went wrong during the logout: \n${handleError(error)}`);
    }
    localStorage.clear();
    this.props.history.push('/login');
  }

  // redirects to lobby
  lobby() {
    this.props.history.push({
      pathname: `/lobby`
    });
  }

  getTotalOpponentPiecesCaptured(gameHistory) {
    const userId = localStorage.getItem('userId');
    let totalOpponentPiecesCaptured = 0;
    for (let i = 0; i < gameHistory.length; i++) {
      const opponentColor = gameHistory[i].playerWhite.userId == userId ? 'BLACK' : 'WHITE';
      for (let j = 0; j < gameHistory[i].pieces.length; j++) {
        if (gameHistory[i].pieces[j].captured &&
            gameHistory[i].pieces[j].color == opponentColor) {
          totalOpponentPiecesCaptured = totalOpponentPiecesCaptured + 1
        }
      }
    }
    return totalOpponentPiecesCaptured;
  }

  componentDidMount() {
    this.setState({
      gamesStats: this.props.location.state.gamesStats,
      gameHistory: this.props.location.state.gameHistory
    });
  }

  componentWillUnmount() {
  }

  render() {
    const gamesStats = this.state.gamesStats;
    const gameHistory = this.state.gameHistory;
    if (gamesStats && gameHistory) {

      const totalOpponentPiecesCaptured = this.getTotalOpponentPiecesCaptured(gameHistory);

      console.log(this.state.gameHistory);

      let time = gamesStats.totalTimePlayed;
      const hours = ~~Math.floor(time / 3600);
      const minutes = ~~((time % 3600) / 60);
      const seconds = ~~time % 60;

      return (
        <div style={{background}}>
          <Grid centered>
            <Grid.Row>
              <div className="ui inverted statistic" style={{marginTop:'25px'}}>
                <div className="label">
                  Number of wins:
                </div>
                <div className="value">
                  {this.state.gamesStats.numberOfWinnings}
                </div>
              </div>
            </Grid.Row>
            <Grid.Row>
              <div className="ui inverted statistic">
                <div className="label">
                  Number of losses:
                </div>
                <div className="value">
                  {this.state.gamesStats.numberOfLosses}
                </div>
              </div>
            </Grid.Row>
            <Grid.Row>
              <div className="ui inverted statistic">
                <div className="label">
                  Number of draws:
                </div>
                <div className="value">
                  {this.state.gamesStats.numberOfDraws}
                </div>
              </div>
            </Grid.Row>
            <Grid.Row>
              <div className="ui inverted statistic">
                <div className="label">
                  time played:
                </div>
                <div className="value">
                  { hours + 'h, ' + minutes + 'm, ' + seconds + 's'}
                </div>
              </div>
            </Grid.Row>
            <Grid.Row>
              <div className="ui inverted statistic">
                <div className="label">
                  Number of pieces captured:
                </div>
                <div className="value">
                  {totalOpponentPiecesCaptured}
                </div>
              </div>
            </Grid.Row>
            <Footer from={'stats'}/>
          </Grid>
        </div>
      );
    } else {
      return (
          <div style={background}>
            <Grid centered>
              <Grid.Row style={{
                marginBottom: '270px',
                marginTop: '270px'
              }}>
                <Header as='h3' style={statsHeaderStyle}>
                  fetching games stats...
                </Header>
              </Grid.Row>
            </Grid>
          </div>
      )
    }
  }
}
export default withRouter(GamesStats);
