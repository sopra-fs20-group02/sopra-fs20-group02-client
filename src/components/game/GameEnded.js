import React from "react";
import { api, handleError } from '../../helpers/api';
import { withRouter } from 'react-router-dom';
import { Grid, Button, Header, Icon } from "semantic-ui-react";
import {gameButtonStyle, gameFooterStyle, quoteStyle, waitingPageStyle} from "../../data/styles";
import {fetchGameStatus} from "../requests/fetchGameStatus";

// TODO: use state or functional component instead of localStorage !

class GameEnded extends React.Component {
    constructor() {
        super();
        this.state = {
            quote: null,
            game: null
        };
    }

    componentDidMount() {
        this.setState({game: this.props.location.state.game});
        this.getRandomQuote();
    }

    // gets random quote
    async getRandomQuote() {
        try {
            const response = await api.get('https://quotes.rest/qod.json');
            this.setState({quote: response.data.contents.quotes[0].quote})
        }
        catch(error) {
            alert(`Something went wrong during the quote fetching: \n${
                handleError(error)
            }`);
        }
    }

    render() {
        return (
        <Grid style={waitingPageStyle} centered>
            <Grid.Row>
                <Header as='h4' style={quoteStyle}>
                    {this.state.quote}
                </Header>
            </Grid.Row>
            <Grid.Row>

                <Header as='h4' style={quoteStyle}>
                    game finished
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
