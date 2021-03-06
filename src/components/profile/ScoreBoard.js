import React from "react";
import { withRouter } from 'react-router-dom';
import { Grid, Header} from "semantic-ui-react";
import {
  gamesStatsHeaderStyle, statsTextStyle, statsStyle, statsHeaderStyle,
   backgroundStats, saddlingHorsesStyle, scoreBoardStyle, background
} from "../../data/styles";

class ScoreBoard extends React.Component {
  constructor() {
    super();
    this.state = {
      users: null,
    };
  }

  // redirects to lobby
  lobby() {
    this.props.history.push({
      pathname: `/lobby`
    });
  }

  // calculates the ranking of all registered users
  getRanking() {
    let userNames = [];
    let wins = [];
    let draws = [];

    this.state.users.forEach(function (user) {
      userNames.push(user.username);
      wins.push(user.userStats.numberOfWinnings);
      draws.push(user.userStats.numberOfDraws);
    });

    const weightedWins = wins.map(function (x) {
      return x * 3;
    });

    const scores = weightedWins.map(function (wins, index) {
      return wins + draws[index];
    });

    const names_scores = Array.prototype.map.call(userNames, function (e, i) {
      return [e, scores[i]];
    })

    const ranking = names_scores.sort(function (i, j) {
      return j[1] - i[1];
    })

    return ranking;
  }

  // returns the scoreboard table
  getTable(){
    let entries = [];
    const users = this.getRanking();
    for (let i = 0; i< users.length; i++){
      if(users[i][0] === localStorage.getItem('userName')) {
        entries.push(
          <tr style={{backgroundColor:'rgba(255, 94, 0, 0.5)'}}>
            <td data-label="Username">{users[i][0]}</td>
            <td data-label="Username">{users[i][1]}</td>
          </tr>
        )
        console.log(users[i]);
      }
      else {
        entries.push(
          <tr>
            <td data-label="Username">{users[i][0]}</td>
            <td data-label="Username">{users[i][1]}</td>
          </tr>
        )
        console.log(users[i]);
      }
    }

    let table = [];

    table.push(
        <table className="ui celled table unstackable" style={scoreBoardStyle}>
          <thead>
          <tr>
            <th>
              Username
            </th>
            <th>
              Score
            </th>
          </tr>
          </thead>
          <tbody>
          {entries}
          </tbody>
        </table>
    )
    return table;
  }

  componentDidMount() {
    this.setState({users: this.props.location.state.users});
  }

  componentWillUnmount() {
  }

  render() {
    const users = this.state.users;
    if (users) {
      return (
          <div style={background}>
            <Grid centered>
              <Grid.Row style={gamesStatsHeaderStyle}>
                <Header as='h1' style={statsTextStyle}>
                  Score Board
                </Header>
              </Grid.Row>
              <Grid.Row columns={2}>
                {this.getTable()}
              </Grid.Row>
            </Grid>
          </div>

      );
    } else {
      return (
          <Grid style={statsStyle} centered>
            <Grid.Row style={saddlingHorsesStyle}
            >
              <Header as='h3' style={statsHeaderStyle}>
                fetching users...
              </Header>
            </Grid.Row>
          </Grid>
      )
    }
  }
}
export default withRouter(ScoreBoard);
