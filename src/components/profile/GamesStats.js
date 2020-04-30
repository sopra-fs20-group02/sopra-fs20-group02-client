import React from "react";
import { withRouter } from 'react-router-dom';
import { Grid, List, Header, Icon} from "semantic-ui-react";
import {
  gamesStatsStyle, gamesStatsHeaderStyle, logoutIconStyle,
  gamesStatsFooterStyle, statsListStyle, statsItemStyle,
  statsTextStyle, statsStyle, statsHeaderStyle
} from "../../data/styles";
import {api, handleError} from "../../helpers/api";

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

  componentDidMount() {
    this.setState({gamesStats: this.props.location.state.gamesStats});
  }

  componentWillUnmount() {
  }

  render() {
    const gamesStats = this.state.gamesStats;
    if (gamesStats) {
      return (
        <Grid style={gamesStatsStyle} centered>
          <Grid.Row style={gamesStatsHeaderStyle}>
            <Header as='h3' style={statsTextStyle}>
              Games Statistics
            </Header>
          </Grid.Row>
          <Grid.Row>
            <List style={statsListStyle}>
              <List.Item style={statsItemStyle}>
                {'Number of wins: ' + this.state.gamesStats.numberOfWinnings}
              </List.Item>
              <List.Item style={statsItemStyle}>
                {'Number of losses: ' + this.state.gamesStats.numberOfLosses}
              </List.Item>
              <List.Item style={statsItemStyle}>
                {'Number of draws: ' + this.state.gamesStats.numberOfDraws}
              </List.Item>
              <List.Item style={statsItemStyle}>
                {'Total time played: ' + this.state.gamesStats.totalTimePlayed}
              </List.Item>
            </List>
          </Grid.Row>
          <Grid.Row style={gamesStatsFooterStyle} columns={2}>
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
                  name='chess'
                  size='large'
                  color='#FF3377'
                  onClick={() => {
                    this.lobby();
                  }}
                />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
    } else {
      return (
          <Grid style={statsStyle} centered>
            <Grid.Row style={{
              marginBottom: '270px',
              marginTop: '270px'
            }}>
              <Header as='h3' style={statsHeaderStyle}>
                fetching games stats...
              </Header>
            </Grid.Row>
          </Grid>
      )
    }
  }
}
export default withRouter(GamesStats);
