import React from "react";
import { api, handleError } from '../../helpers/api';
import { withRouter } from 'react-router-dom';
import { Grid, Header } from "semantic-ui-react";
import { quoteStyle, background, buttonStyle } from "../../data/styles";
import {fetchGameStatus} from "../requests/fetchGameStatus";

class Waiting extends React.Component {
    constructor() {
        super();
        this.state = {
            quote: null,
            gameId: null,
            gameDeleted: false
        };
    }

    componentDidMount() {
        this.setState({
            gameId: this.props.location.state.gameId
        });
        this.getRandomQuote();
        this.handleWaiting();
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    // fetching random quote from external API
    async getRandomQuote() {
        try {
            const response = await api.get('https://quotes.rest/qod.json');
            this.setState({quote: response.data.contents.quotes[0].quote})
        }
        catch(error) {
            const info = handleError(error);
            if (info !== 'Too Many Requests') {
                console.log(info);
            }
        }
    }

    // redirects to lobby
    lobby() {
        this.props.history.push({
            pathname: `/lobby/main`
        });
    }

    // deletes the game
    async deleteGame() {
        try {
            const response = await api.delete('/games/' + this.state.gameId);
            console.log(response);
            this.setState({ gameDeleted: true })
        }
        catch(error) {
            console.log(error);
        }
    }

    // handles waiting
    async handleWaiting() {
        let status = 'WAITING';
        localStorage.setItem('remainingTime', '300');
        this.interval = setInterval(async () => {
            if (!this.state.gameDeleted) {
                const gameStatusObject = await fetchGameStatus(localStorage.getItem('userId'), this.state.gameId);
                if (gameStatusObject.data){
                    status = gameStatusObject.data.gameStatus
                }

                if (status === 'FULL') {
                    this.props.history.push({
                        pathname: '/game/play',
                        state: {
                            gameId: gameStatusObject.data.gameId
                        }
                    });
                }
            }
        }, 1000); // TODO: maybe make smaller intervals
    }

    render() {
        return (
            <div style={background}>
                <Grid centered>
                    <Grid.Row>
                        <Header as='h4' style={quoteStyle}>
                            {this.state.quote}
                        </Header>
                    </Grid.Row>
                    <Grid.Row>
                        <div className="ui active inverted loader"></div>
                    </Grid.Row>
                    <Grid.Row>
                        <Header as='h4' style={quoteStyle}>
                            {this.state.gameDeleted ? 'Game was deleted' : 'Waiting...'}
                        </Header>
                    </Grid.Row>
                    <Grid.Row columns={2}>
                        <Grid.Column textAlign='center'>

                            <button className="ui inverted button" style={buttonStyle} onClick={() => {
                                if (this.state.gameDeleted) {
                                    this.lobby();
                                } else {
                                    this.deleteGame();
                                }
                            }}>
                                {this.state.gameDeleted ? 'Lobby' : 'Delete Game'}
                            </button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}

export default withRouter(Waiting);
