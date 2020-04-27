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
            quote: null
        };
    }

    componentDidMount() {
        this.getRandomQuote();
        this.handleWaiting();
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

    // update game status
    async fetchGameStatus() {
        try {
            const parameters = JSON.stringify({
                userId: JSON.parse(localStorage.getItem('user')).userId,
            });
            const mapping = '/games/' + this.state.game.gameId.toString();

            const game = await api.get(mapping, {params: parameters});
            this.setState({ game : game });

        } catch (error) {
            if(error.response.status === 409){
                alert(error.response.data);
            }
            else {
                alert(`Something went wrong while trying to get the game status: \n${handleError(error)}`);
            }
        }
    }

    async handleWaiting() {
        let status;
        do {
            setInterval(async () => {
                status = fetchGameStatus().gameStatus;
                console.log(status)
                // TODO: make smaller intervals
            }, 500);
        } while (status === 'WAITING');

        if (status === 'FULL') {
            this.props.history.push('/game');
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
                    Waiting...
                </Header>
            </Grid.Row>
        </Grid>
        );
    }
}

export default withRouter(Waiting);
