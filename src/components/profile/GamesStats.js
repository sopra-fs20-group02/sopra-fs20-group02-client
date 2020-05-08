import React from "react";
import { withRouter } from 'react-router-dom';
import { Grid, Header} from "semantic-ui-react";
import {statsHeaderStyle, background} from "../../data/styles";
import {api, handleError} from "../../helpers/api";
import Footer from "../game/Footer";
import {XYPlot, LineSeries, ArcSeries} from 'react-vis';
import DiscreteColorLegend from "react-vis/es/legends/discrete-color-legend";

const PI = 3.14159265359;
class GamesStats extends React.Component {
  constructor() {
    super();
    this.state = {
      gamesStats: null,
      gameHistory: null
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

  getNumberOfGames(gamesStats) {
    return gamesStats.numberOfWinnings + gamesStats.numberOfLosses + gamesStats.numberOfDraws;
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

  getTotalOwnPiecesCaptured(gameHistory) {
    const userId = localStorage.getItem('userId');
    let totalOwnPiecesCaptured = 0;
    for (let i = 0; i < gameHistory.length; i++) {
      const color = gameHistory[i].playerWhite.userId == userId ? 'WHITE' : 'BLACK';
      for (let j = 0; j < gameHistory[i].pieces.length; j++) {
        if (gameHistory[i].pieces[j].captured &&
            gameHistory[i].pieces[j].color == color) {
          totalOwnPiecesCaptured = totalOwnPiecesCaptured + 1
        }
      }
    }
    return totalOwnPiecesCaptured;
  }

  getAverageOpponentPiecesCaptured(gameHistory) {
    if (gameHistory.length != 0) {
      return this.getTotalOpponentPiecesCaptured(gameHistory) / gameHistory.length;
    } else {
      return '-';
    }
  }

  getAverageOwnPiecesCaptured(gameHistory) {
    if (gameHistory.length != 0) {
      return this.getTotalOwnPiecesCaptured(gameHistory) / gameHistory.length;
    } else {
      return '-';
    }
  }

  getTotalTimePlayed(gamesStats) {
    let time = gamesStats.totalTimePlayed;
    const hours = ~~Math.floor(time / 3600);
    const minutes = ~~((time % 3600) / 60);
    const seconds = ~~time % 60;
    return [hours, minutes, seconds];
  }

  getAveragePlayTime(gameHistory) {

    let totalHoursPlayed = 0;
    let totalMinutesPlayed = 0;
    let totalSecondsPlayed = 0;

    // one could just use the total time played from the gamesStats
    // but we might want to e.g. plot the individual game times
    for (let i = 0; i < gameHistory.length; i++) {
      const endTime = gameHistory[i].endTime;
      const startTime = gameHistory[i].startTime;
      const endDate = new Date(endTime.substring(0, endTime.length - 4) + 'Z');
      const startDate = new Date(startTime.substring(0, startTime.length - 4) + 'Z');

      let hoursDifference = endDate.getHours() - startDate.getHours();
      let minutesDifference = endDate.getMinutes() - startDate.getMinutes();
      let secondsDifference = endDate.getSeconds() - startDate.getSeconds();

      totalHoursPlayed = totalHoursPlayed + hoursDifference;
      totalMinutesPlayed = totalMinutesPlayed + minutesDifference;
      totalSecondsPlayed = totalSecondsPlayed + secondsDifference;

    }

    const numberOfGamesPlayed = gameHistory.length;
    const totalPlayTime = totalSecondsPlayed + totalMinutesPlayed * 60 + totalHoursPlayed * 60 ** 2;
    const averagePlayTime = totalPlayTime / numberOfGamesPlayed;

    const averageHours = ~~Math.floor(averagePlayTime / 3600);
    const averageMinutes = ~~((averagePlayTime % 3600) / 60);
    const averageSeconds = ~~averagePlayTime % 60;

    return [averageHours, averageMinutes, averageSeconds];
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
      const totalOwnPiecesCaptured = this.getTotalOwnPiecesCaptured(gameHistory);
      const averageOpponentPiecesCaptures = this.getAverageOpponentPiecesCaptured(gameHistory);
      const averageOwnPiecesCaptures = this.getAverageOwnPiecesCaptured(gameHistory);
      const totalTimePlayed = this.getTotalTimePlayed(gamesStats);
      const averagePlayTime = this.getAveragePlayTime(gameHistory);
      const numberOfGames = this.getNumberOfGames(gamesStats);

      console.log(2*PI*this.state.gamesStats.numberOfWinnings / numberOfGames);

      return (
        <div style={{background}}>
          <Grid columns={2} divided inverted padded centered>
            <Grid.Row>
              <Grid.Column>
                <div style={{width:'150px', height:'150px', margin:'0 auto'} }>
                  <XYPlot
                      xDomain={[0, 1]}
                      yDomain={[0, 1]}
                      width={150}
                      height={150}
                  >
                    <ArcSeries
                        animation
                        radiusType={'literal'}
                        center={{x: 0.5, y: 0.5}}
                        data={[
                          {angle0: 0, angle: 2*PI*this.state.gamesStats.numberOfWinnings / (numberOfGames + 0.00001), opacity: 1, radius: 50, radius0: 40, color: "#e5ff3a"},
                          {
                            angle0: 2*PI*this.state.gamesStats.numberOfWinnings / (numberOfGames + 0.001),
                            angle: 2*PI* (this.state.gamesStats.numberOfWinnings  + this.state.gamesStats.numberOfDraws )/ (numberOfGames + 0.00001),
                            opacity: 1, radius: 50, radius0:  40, color: "#009aff"
                          },
                          {
                            angle0: 2*PI* (this.state.gamesStats.numberOfWinnings  + this.state.gamesStats.numberOfDraws )/ (numberOfGames + 0.00001),
                            angle: 2*PI,
                            opacity: 1, radius: 50, radius0:  40, color: "#ff0044"
                          }
                        ]}
                        colorType={'literal'}/>
                  </XYPlot>
                </div>
              </Grid.Column>
              <Grid.Column>
                <div style={{width:'150px', height:'150px', margin:'0 auto'} }>
                  <XYPlot
                      xDomain={[0, 1]}
                      yDomain={[0, 1]}
                      width={150}
                      height={150}
                  >
                    <ArcSeries
                        animation
                        radiusType={'literal'}
                        center={{x: 0.5, y: 0.5}}
                        data={[
                          {angle0: 0, angle: 2*PI*totalOpponentPiecesCaptured / (totalOpponentPiecesCaptured + totalOwnPiecesCaptured + 0.001), opacity: 1, radius: 50, radius0: 40, color: "#e5ff3a"},
                          {
                            angle0: 2*PI*totalOpponentPiecesCaptured / (totalOpponentPiecesCaptured + totalOwnPiecesCaptured + 0.001),
                            angle: 2*PI,
                            opacity: 1, radius: 50, radius0:  40, color: "#ff0044"
                          },
                        ]}
                        colorType={'literal'}/>
                  </XYPlot>
                </div>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row centered>
              <Grid.Column>
                <DiscreteColorLegend
                    orientation="horizontal"
                    style={{color:"white"}}
                    items={[{title: "won", color:"#e5ff3a"},{title: "draw", color:"#009aff"},{title: "lost", color:"#ff0044"}]}>
                </DiscreteColorLegend>
              </Grid.Column>
              <Grid.Column>
                <DiscreteColorLegend
                    orientation="horizontal"
                    style={{color:"white"}}
                    items={[{title: "Pieces won", color:"#e5ff3a"},{title: "Pieces lost", color:"#009aff"}]}>
                </DiscreteColorLegend>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <div className="ui inverted statistic" style={{marginTop:'25px'}}>
                  <div className="label">
                    Number of games:
                  </div>
                  <div className="value">
                    {numberOfGames}
                  </div>
                </div>
              </Grid.Column>
              <Grid.Column>
                <div className="ui inverted statistic">
                  <div className="label">
                    Number of wins:
                  </div>
                  <div className="value">
                    {this.state.gamesStats.numberOfWinnings}
                  </div>
                </div>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <div className="ui inverted statistic">
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
                  Total time played:
                </div>
                <div className="value">
                  { totalTimePlayed[0] + 'h, ' + totalTimePlayed[1] + 'm, ' + totalTimePlayed[2] + 's'}
                </div>
              </div>
            </Grid.Row>
            <Grid.Row>
              <div className="ui inverted statistic">
                <div className="label">
                  Average game time:
                </div>
                <div className="value">
                  {(gameHistory.length != 0) ?
                      averagePlayTime[0] + 'h, ' +averagePlayTime[1] + 'm, ' + averagePlayTime[2] + 's' : '-'}
                </div>
              </div>
            </Grid.Row>
            <Grid.Row>
              <div className="ui inverted statistic">
                <div className="label">
                  Total opponent pieces captured:
                </div>
                <div className="value">
                  {totalOpponentPiecesCaptured}
                </div>
              </div>
            </Grid.Row>
            <Grid.Row>
              <div className="ui inverted statistic">
                <div className="label">
                  Total own pieces captured:
                </div>
                <div className="value">
                  {totalOwnPiecesCaptured}
                </div>
              </div>
            </Grid.Row>
            <Grid.Row>
              <div className="ui inverted statistic">
                <div className="label">
                  Average opponent pieces captured:
                </div>
                <div className="value">
                  {averageOpponentPiecesCaptures}
                </div>
              </div>
            </Grid.Row>
            <Grid.Row>
              <div className="ui inverted statistic">
                <div className="label">
                  Average own pieces captured:
                </div>
                <div className="value">
                  {averageOwnPiecesCaptures}
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
