import React from "react";
import { api, handleError } from '../../helpers/api';
import { withRouter } from 'react-router-dom';
import { Grid, Button, Header, Icon } from "semantic-ui-react";
import {gameButtonStyle, gameFooterStyle, quoteStyle, waitingPageStyle} from "../../data/styles";
import {fetchGameStatus} from "../requests/fetchGameStatus";

class GameEnded extends React.Component {
    constructor() {
        super();
        this.state = {
            quote: null,
            game: null
        };
    }

    componentDidMount() {
        this.setState({
            game: this.props.location.state.game,
            isWatching: this.props.location.state.isWatching
        });
        this.getRandomQuote();
    }

    // gets random quote
    async getRandomQuote() {
        try {
            const response = await api.get('https://quotes.rest/qod.json');
            this.setState({quote: response.data.contents.quotes[0].quote})
            console.log(response);
        }
        catch(error) {
            const info = handleError(error);
            if (info !== 'Too Many Requests') {
                alert(`Something went wrong during the quote fetching: \n${info}`);
            }
        }
    }

    getEndMessage() {
        if (this.state.game) {
            if (this.state.game.winner === Number(localStorage.getItem('userId'))) {
                return 'You won!';
            } else if (this.state.isWatching) {
                if (this.state.game.winner === this.state.game.playerBlack.userId) {
                    return this.state.game.playerBlack.username + ' won';
                } else {
                    return this.state.game.playerWhite.username + ' won';
                }
            } else {
                return 'You lost!';
            }
        }
    }

    render() {
        console.log(this.state.game);
        return (
        <Grid style={waitingPageStyle} centered>
            <Grid.Row>
                <Header as='h4' style={quoteStyle}>
                    {this.state.quote}
                </Header>
            </Grid.Row>
            <Grid.Row>
                <Header as='h1' style={quoteStyle}>
                    {this.getEndMessage()}
                </Header>
            </Grid.Row>
            <Grid.Row columns={2} style={gameFooterStyle}>
                <Grid.Column textAlign='center'>
                    <Button
                        style={gameButtonStyle}
                        onClick={() => {
                            this.props.history.push({
                                pathname: '/lobby',
                            })
                        }}
                    >
                        Lobby
                    </Button>
                </Grid.Column>
            </Grid.Row>
        </Grid>
        );
    }
}

export default withRouter(GameEnded);
