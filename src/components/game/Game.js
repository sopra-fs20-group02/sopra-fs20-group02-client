import React from 'react';
import { api, handleError } from '../../helpers/api';
import { withRouter } from 'react-router-dom';
import { Grid, Button, Header, Icon } from "semantic-ui-react";
import {
    gameStyle, gameButtonStyle, gameHeaderStyle,
    chessBoardStyle, boardRankStyle, chessPieceStyle, gameFooterStyle
} from "../../data/styles";

class Game extends React.Component {
    constructor() {
        super();
        this.state = {
            users: null,
            pieces: [
                'chess bishop', 'chess king', 'chess knight',
                'chess pawn', 'chess queen', 'chess rook'
            ]
        };
    }

    // handles move when a piece is selected
    async moveHandling() {
        // TODO: IMPLEMENT
    }

    // logs out user
    async logout() {
        try {
            const requestBody = JSON.stringify({
                userId: localStorage.getItem('userId')
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
        const game = JSON.parse(localStorage.getItem('game'))
        const opponentName = game.playerWhite.name === localStorage.getItem('name') ?
            game.playerBlack.name : game.playerWhite.name;

        return (
        <Grid style={gameStyle} centered>
            <Grid.Row>
                <Header as='h1' style={gameHeaderStyle}>
                    {'Game against ' + opponentName}
                </Header>
            </Grid.Row>
            <Grid
                style={chessBoardStyle}
            >
            {Array.from(Array(8).keys()).map((rank) => {
                return (
                    <Grid.Row
                        style={boardRankStyle}
                    >
                        {Array.from(Array(8).keys()).map((file) => {
                            let color = '#FF8998';
                            if (file % 2 == rank % 2) { color = 'white'; }

                            let pieceType;
                            let pieceColor;
                            game.pieces.forEach(function (piece) {
                                if (piece.xcord === 1 + file && piece.ycord === 8 - rank) {
                                    pieceType = 'chess ' + piece.pieceType.toLowerCase();
                                    pieceColor = piece.color.toLowerCase();
                                }
                                if (pieceColor === 'white') { pieceColor = 'grey'; }
                            })

                            return(
                                <Grid.Column
                                    width={2} style={{
                                        alignContent: 'center',
                                        background: color,
                                        height: '40px'
                                    }}
                                >
                                    {(pieceType) && (
                                        <Icon
                                            style={{
                                                marginTop: '10px',
                                                paddingRight: '15px',
                                                align: 'center',
                                                color: pieceColor,
                                            }}
                                            name={pieceType}
                                            size='large'
                                            onClick={() => {
                                                this.moveHandling();
                                            }}
                                        />)
                                    }
                                </Grid.Column>
                            )
                        })}
                    </Grid.Row>
                )
            })}
            </Grid>
            <Grid.Row columns={2} style={gameFooterStyle}>
                <Grid.Column textAlign='center'>
                    <Button
                        style={gameButtonStyle}
                    >
                        Resign
                    </Button>
                </Grid.Column>
                <Grid.Column textAlign='center'>
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
