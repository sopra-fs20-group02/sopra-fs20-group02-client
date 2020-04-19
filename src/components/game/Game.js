import React from 'react';
import { api, handleError } from '../../helpers/api';
import { withRouter } from 'react-router-dom';
import { Grid, Button, Header, Icon } from "semantic-ui-react";
import {
    gameStyle, gameButtonStyle, gameHeaderStyle,
    chessBoardStyle, boardRankStyle, quoteStyle, gameFooterStyle
} from "../../data/styles";

class Game extends React.Component {
    constructor() {
        super();
        this.state = {
            users: null,
            pieces: [
                'chess bishop', 'chess king', 'chess knight',
                'chess pawn', 'chess queen', 'chess rook'
            ],
            game: JSON.parse(localStorage.getItem('game')),
        };
    }

    // get all possible moves for selected piece
    async getPossibleMoves(pieceId) {
        try {
            const requestBody = JSON.stringify({
                userId: JSON.parse(localStorage.getItem('user')).userId
            });
            const mapping = '/games/' + this.state.game.gameId.toString() + '/' + pieceId.toString();
            const response = await api.get(mapping, requestBody);

            localStorage.setItem('possibleMoves', JSON.stringify(response.data));

        } catch (error) {
            if(error.response.status === 409){
                alert(error.response.data);
            }
            else {
                alert(`Something went wrong while getting the possible moves: \n${handleError(error)}`);
            }
        }
    }

    // logs out user
    async logout() {
        try {
            const requestBody = JSON.stringify({
                userId: JSON.parse(localStorage.getItem('user')).userId
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
        localStorage.clear();
        this.props.history.push('/login');
    }

    componentDidMount() {}

    render() {
        const game = JSON.parse(localStorage.getItem('game'));

        const opponent = game.playerWhite.username ===
            JSON.parse(localStorage.getItem('user')).username ?
            game.playerBlack.username : game.playerWhite.username;

        return (
        <Grid style={gameStyle} centered>
            <Grid.Row>
                <Header as='h4' style={quoteStyle}>
                    {localStorage.getItem('quote')}
                </Header>
            </Grid.Row>
            <Grid.Row>
                <Header as='h2' style={gameHeaderStyle}>
                    {'Game against ' + opponent}
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
                            let pieceId;
                            game.pieces.forEach(function (piece) {
                                if (piece.xcord === 1 + file && piece.ycord === 8 - rank) {
                                    pieceType = 'chess ' + piece.pieceType.toLowerCase();
                                    pieceColor = piece.color.toLowerCase();
                                    pieceId = piece.pieceId;
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
                                                this.getPossibleMoves(pieceId);
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
