import React from "react";
import { api, handleError } from '../../helpers/api';
import { withRouter } from 'react-router-dom';
import { Grid, Button, Header, Icon } from "semantic-ui-react";
import {quoteStyle, waitingPageStyle} from "../../data/styles";
import {fetchGameStatus} from "../requests/fetchGameStatus";

// TODO: use state or functional component instead of localStorage !

class Waiting extends React.Component {
    constructor() {
        super();
        this.state = {
            quote: null,
            gameId: null
        };
    }

    componentDidMount() {
        this.setState({gameId: this.props.location.state.gameId});
        this.getRandomQuote();
        this.handleWaiting();
    }

    componentWillUnmount() {
        clearInterval(this.interval);
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

    async handleWaiting() {
        let status = 'WAITING';

        this.interval = setInterval(async () => {
            const  gameStatusObject = await fetchGameStatus(localStorage.getItem('userId'), this.state.gameId);
            if (gameStatusObject.data){
                status = gameStatusObject.data.gameStatus
            }

            if (status === 'FULL') {
                this.props.history.push({
                    pathname: '/game',
                    state: { gameId: gameStatusObject.data.gameId }
                });
            }

            // TODO: make smaller intervals
        }, 1000);

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
                    Waiting...
                </Header>
            </Grid.Row>
        </Grid>
        );
    }
}

export default withRouter(Waiting);
