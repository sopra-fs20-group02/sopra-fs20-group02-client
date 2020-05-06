import React from "react";
import { withRouter } from 'react-router-dom';
import { Grid, List, Header, Icon} from "semantic-ui-react";
import {
  gamesStatsStyle, gamesStatsHeaderStyle, logoutIconStyle,
  gamesStatsFooterStyle, statsListStyle, statsItemStyle,
  statsTextStyle, statsStyle, statsHeaderStyle, formStyle, inputFieldStyle, controlButtonStyle, background
} from "../../data/styles";
import {api, handleError} from "../../helpers/api";
import Footer from "../game/Footer";

class ScoreBoard extends React.Component {
  constructor() {
    super();
    this.state = {
      users: null,
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

  componentDidMount() {
    this.setState({users: this.props.location.state.users});
  }

  componentWillUnmount() {
  }

  getTable(){
    let entries = [];
    const users = this.getRanking();
    for (let i = 0; i< users.length; i++){
      entries.push(
          <tr>
            <td data-label="Username">{users[i][0]}</td>
            <td data-label="Username">{users[i][1]}</td>
          </tr>
      )
      console.log(users[i]);
    }

    let table = [];

    table.push(
        <div style={{
          height: '80%',
          overflowY: 'scroll'
        }}>
          <table className="ui celled table unstackable"
                 style={{width: '100%', maxWidth: '600px', backgroundColor: 'rgba(43,43,43,0.8)', color: 'white'}}>
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
        </div>

    )

    return table;
  }

  render() {
    const users = this.state.users;
    if (users) {
      return (
          <div style={background}>
            <Grid centered>
              <Grid.Row style={gamesStatsHeaderStyle}>
                <Header as='h3' style={statsTextStyle}>
                  Score Board
                </Header>
              </Grid.Row>
              <Grid.Row columns={2}>
                {this.getTable()}
              </Grid.Row>
              <Footer from={'scores'}/>
            </Grid>
          </div>
      );
    } else {
      return (
          <Grid style={statsStyle} centered>
            <Grid.Row style={{
              marginBottom: '270px',
              marginTop: '270px'
            }}
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
