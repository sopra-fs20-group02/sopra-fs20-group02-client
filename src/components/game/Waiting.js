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
            quote: localStorage.getItem('quote'),
        };
    }

    // update game status
    async fetchGameStatus() {
        window.alert('test');
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
        let status = 'WAITING';
        while (status === 'WAITING') {
            setInterval(async () => {
                status = fetchGameStatus().gameStatus;
                // TODO: make smaller intervals
            }, 10000);
        }
        if (status === 'FULL') {
            this.props.history.push('/game');
        }
    }


    render() {
        this.handleWaiting()

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
