import React from "react";
import { api, handleError } from '../../helpers/api';
import { withRouter } from 'react-router-dom';
import { Grid, Header } from "semantic-ui-react";
import {
    background,
    buttonStyle,
    gameFooterStyle,
    quoteStyle,
} from "../../data/styles";

class GameEnded extends React.Component {
    constructor() {
        super();
        this.state = {
            quote: null,
            game: null,
            ranOutOfTime: false
        };
    }

    componentDidMount() {
        this.setState({
            game: this.props.location.state.game,
            isWatching: this.props.location.state.isWatching,
            ranOutOfTime: this.props.location.state.ranOutOfTime
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
        let endMessage;
        if (this.state.game) {
            console.log('endmessage: ');
            console.log(this.state.game);
            console.log(this.state.game.gameStatus);
            if (this.state.game.gameStatus === 'DRAW') {
                console.log('entersloop');
                endMessage = "It's a draw!";
            } else if (this.state.game.winner === Number(localStorage.getItem('userId'))) {
                endMessage = 'You won!';
            } else if (this.state.isWatching) {
                if (this.state.game.winner === this.state.game.playerBlack.userId) {
                    endMessage = this.state.game.playerBlack.username + ' won';
                } else {
                    endMessage =  this.state.game.playerWhite.username + ' won';
                }
            } else {
                endMessage =  'You lost!';
                if (this.state.ranOutOfTime) {
                    endMessage = 'You ran out of time. ' + endMessage;
                }
            }
        }
        return endMessage;
    }

    render() {
        console.log(this.state.game);
        return (
            <div style={background}>
                <Grid centered>
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
                            <button className="ui inverted button" style={buttonStyle}
                                onClick={() => {
                                    this.props.history.push({
                                        pathname: '/lobby/main',
                                    })
                                }}
                            >
                                Lobby
                            </button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}

export default withRouter(GameEnded);
