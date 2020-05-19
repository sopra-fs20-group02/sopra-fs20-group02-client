import React from "react";
import { withRouter } from 'react-router-dom';
import { Grid, Header} from "semantic-ui-react";
import {statsHeaderStyle, background, backgroundStats} from "../../data/styles";
import {XYPlot, ArcSeries} from 'react-vis';
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

  // redirects to lobby
  lobby() {
    this.props.history.push({
      pathname: `/main/lobby`
    });
  }

  getTotalOpponentPiecesCaptured(gameHistory) {
    const userId = localStorage.getItem('userId');
    let totalOpponentPiecesCaptured = 0;
    for (let i = 0; i < gameHistory.length; i++) {
      const opponentColor = gameHistory[i].playerWhite.userId === userId ? 'BLACK' : 'WHITE';
      for (let j = 0; j < gameHistory[i].pieces.length; j++) {
        if (gameHistory[i].pieces[j].captured &&
            gameHistory[i].pieces[j].color === opponentColor) {
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
      const color = gameHistory[i].playerWhite.userId === userId ? 'WHITE' : 'BLACK';
      for (let j = 0; j < gameHistory[i].pieces.length; j++) {
        if (gameHistory[i].pieces[j].captured &&
            gameHistory[i].pieces[j].color === color) {
          totalOwnPiecesCaptured = totalOwnPiecesCaptured + 1
        }
      }
    }
    return totalOwnPiecesCaptured;
  }

  getAverageOpponentPiecesCaptured(gameHistory) {
    if (gameHistory.length !== 0) {
      return this.getTotalOpponentPiecesCaptured(gameHistory) / gameHistory.length;
    } else {
      return 0;
    }
  }

  getAverageOwnPiecesCaptured(gameHistory) {
    if (gameHistory.length !== 0) {
      return this.getTotalOwnPiecesCaptured(gameHistory) / gameHistory.length;
    } else {
      return 0;
    }
  }

  getTotalTimePlayed(gamesStats) {
    let time = gamesStats.totalTimePlayed;
    const hours = ~~Math.floor(time / 3600);
    const minutes = ~~((time % 3600) / 60);
    const seconds = ~~time % 60;
    return [hours, minutes, seconds];
  }

  getAveragePlayTime(gamesStats, gameHistory) {

    const averagePlayTime = (gamesStats.totalTimePlayed) / gameHistory.length;
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

      let totalOpponentPiecesCaptured = 0;
      let totalOwnPiecesCaptured = 0;
      let averageOpponentPiecesCaptures = 0;
      let averageOwnPiecesCaptures = 0;
      let totalTimePlayed = 0;
      let averagePlayTime = 0;
      let numberOfGames = gameHistory.length;
      try {
        totalOpponentPiecesCaptured = this.getTotalOpponentPiecesCaptured(gameHistory);
        totalOwnPiecesCaptured = this.getTotalOwnPiecesCaptured(gameHistory);
        averageOpponentPiecesCaptures = this.getAverageOpponentPiecesCaptured(gameHistory);
        averageOwnPiecesCaptures = this.getAverageOwnPiecesCaptured(gameHistory);
        totalTimePlayed = this.getTotalTimePlayed(gamesStats);
        averagePlayTime = this.getAveragePlayTime(gamesStats, gameHistory);
      }
      catch (e) {
        console.error(e);
      }
      return (
          <div style={backgroundStats}>
          <div style={{maxWidth: '1000px', margin: '0 auto'}}>
            <Grid centered columns='equal' inverted padded  divided='vertically'>
              <Grid.Row>
                <Grid.Column width={12}>
                  <div style={{width:'400px', height:'300px', margin:'0 auto'} }>
                    <XYPlot
                        xDomain={[0, 1]}
                        yDomain={[0, 1]}
                        width={400}
                        height={300}
                    >
                      <ArcSeries
                          animation
                          radiusType={'literal'}
                          center={{x: 0.5, y: 0.5}}
                          data={[
                            {angle0: 0, angle: 2*PI*this.state.gamesStats.numberOfWinnings / (numberOfGames + 0.00001), opacity: 1, radius: 100, radius0: 40, color: "#e5ff3a"},
                            {
                              angle0: 2*PI*this.state.gamesStats.numberOfWinnings / (numberOfGames + 0.001),
                              angle: 2*PI* (this.state.gamesStats.numberOfWinnings  + this.state.gamesStats.numberOfDraws )/ (numberOfGames + 0.00001),
                              opacity: 1, radius: 100, radius0:  40, color: "#009aff"
                            },
                            {
                              angle0: 2*PI* (this.state.gamesStats.numberOfWinnings  + this.state.gamesStats.numberOfDraws )/ (numberOfGames + 0.00001),
                              angle: 2*PI,
                              opacity: 1, radius: 100, radius0:  40, color: "#ff0044"
                            }
                          ]}
                          colorType={'literal'}/>
                    </XYPlot>
                  </div>
                </Grid.Column>
                <Grid.Column>
                  <DiscreteColorLegend
                      orientation="horizontal"
                      style={{color:"white"}}
                      items={[{title: "Games won", color:"#e5ff3a"},{title: "draw", color:"#009aff"},{title: "Games lost", color:"#ff0044"}]}>
                  </DiscreteColorLegend>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <div className="ui inverted statistic">
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
                <Grid.Column>
                  <div className="ui inverted statistic">
                    <div className="label">
                      Number of losses:
                    </div>
                    <div className="value">
                      {this.state.gamesStats.numberOfLosses}
                    </div>
                  </div>
                </Grid.Column>
                <Grid.Column>
                  <div className="ui inverted statistic">
                    <div className="label">
                      Number of draws:
                    </div>
                    <div className="value">
                      {this.state.gamesStats.numberOfDraws}
                    </div>
                  </div>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column>
                  <div className="ui inverted statistic">
                    <div className="label">
                      Total time played:
                    </div>
                    <div className="value">
                      { totalTimePlayed[0] + 'h, ' + totalTimePlayed[1] + 'm, ' + totalTimePlayed[2] + 's'}
                    </div>
                  </div>
                </Grid.Column>
                <Grid.Column>
                  <div className="ui inverted statistic">
                    <div className="label">
                      Average game time:
                    </div>
                    <div className="value">
                      {(gameHistory.length !== 0) ?
                          averagePlayTime[0] + 'h, ' +averagePlayTime[1] + 'm, ' + averagePlayTime[2] + 's' : '-'}
                    </div>
                  </div>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <DiscreteColorLegend
                      orientation="horizontal"
                      style={{color:"white"}}
                      items={[{title: "Pieces won", color:"#e5ff3a"},{title: "Pieces lost", color:"#ff0044"}]}>
                  </DiscreteColorLegend>
                </Grid.Column>
                <Grid.Column width={12}>
                  <div style={{width:'300px', height:'300px', margin:'0 auto'} }>
                    <XYPlot
                        xDomain={[0, 1]}
                        yDomain={[0, 1]}
                        width={300}
                        height={300}
                    >
                      <ArcSeries
                          animation
                          radiusType={'literal'}
                          center={{x: 0.5, y: 0.5}}
                          data={[
                            {angle0: 0, angle: 2*PI*totalOpponentPiecesCaptured / (totalOpponentPiecesCaptured + totalOwnPiecesCaptured + 0.001), opacity: 1, radius: 100, radius0: 40, color: "#e5ff3a"},
                            {
                              angle0: 2*PI*totalOpponentPiecesCaptured / (totalOpponentPiecesCaptured + totalOwnPiecesCaptured + 0.001),
                              angle: 2*PI,
                              opacity: 1, radius: 100, radius0:  40, color: "#ff0044"
                            },
                          ]}
                          colorType={'literal'}/>
                    </XYPlot>
                  </div>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <div className="ui inverted statistic">
                    <div className="label">
                      Total opponent pieces captured:
                    </div>
                    <div className="value">
                      {totalOpponentPiecesCaptured}
                    </div>
                  </div>
                </Grid.Column>
                <Grid.Column>
                  <div className="ui inverted statistic">
                    <div className="label">
                      Average opponent pieces captured:
                    </div>
                    <div className="value">
                      {gameHistory.length !== 0 ? averageOpponentPiecesCaptures.toFixed(1) : '-'}
                    </div>
                  </div>
                </Grid.Column>
                <Grid.Column>
                  <div className="ui inverted statistic">
                    <div className="label">
                      Average own pieces captured:
                    </div>
                    <div className="value">
                      {gameHistory.length !== 0 ? averageOwnPiecesCaptures.toFixed(1) : '-'}
                    </div>
                  </div>
                </Grid.Column>
                <Grid.Column>
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
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
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
