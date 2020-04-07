import React from 'react';
import { api, handleError } from '../../helpers/api';
import { withRouter } from 'react-router-dom';
import { Grid, Button, Header, Icon } from "semantic-ui-react";
import {
    lobbyStyle, gameButtonStyle, lobbyHeaderStyle
} from "../../data/styles";

class Game extends React.Component {
    constructor() {
        super();
        this.state = {
            users: null,
            pieces: ['chess bishop', 'chess king', 'chess knight', 'chess pawn', 'chess queen', 'chess rook']
        };
    }

    openProfile(id) {
        this.props.history.push(`/lobby/profile/${id}`);
    }

    async logout() {
        try {
            const requestBody = JSON.stringify({
                token: localStorage.getItem("token")
            });
            const response = await api.put('/logout', requestBody);

        } catch(error) {
            if(error.response.status === 404) {
            alert(error.response.data);
        } else {
            alert(`Something went wrong during the logout: \n${
                handleError(error)
            }`);
            }
        }
        localStorage.removeItem('token');
        this.props.history.push('/login');
    }

    render() {
        return (
        <Grid style={lobbyStyle} centered>
            <Grid.Row>
                <Header as='h1' style={lobbyHeaderStyle}>
                    {'Game against ' + localStorage.getItem('currentOpponent')}
                </Header>
            </Grid.Row>
            <Grid
                style={{width: '95%', marginTop: '20px', marginBottom: '20px'}}
            >
            {Array.from(Array(8).keys()).map((row) => {
                return (
                    <Grid.Row
                        style={{margin: '0px', padding: '0px'}}
                    >
                        {Array.from(Array(8).keys()).map((tile) => {
                            let color = 'white';
                            if (tile % 2 == 0) {
                                color = 'white';
                            } else {
                                color = 'black';
                            }
                            if (row % 2 == 0) {
                                if (color == 'white') {
                                    color = 'black';
                                } else {
                                    color = 'white';
                                }
                            }
                            return(
                                <Grid.Column width={2} style={{alignContent: 'center', background: color, height: '40px'}}>
                                    <Icon
                                        style={{align: 'center'}}
                                        name={this.state.pieces[Math.floor(row/2)]}
                                        size='large'
                                        flipped='horizontally'
                                        onClick={() => {
                                            this.logout();
                                        }}
                                    />
                                </Grid.Column>
                            )
                        })}
                    </Grid.Row>
                )
            })}
            </Grid>
            <Grid.Row columns={2}>
                <Grid.Column>
                    <Button
                        style={gameButtonStyle}
                    >
                        Resign
                    </Button>
                </Grid.Column>
                <Grid.Column>
                    <Button
                        style={gameButtonStyle}
                    >
                        Offer draw
                    </Button>
                </Grid.Column>
            </Grid.Row>
        </Grid>
        );
    }
}

export default withRouter(Game);
