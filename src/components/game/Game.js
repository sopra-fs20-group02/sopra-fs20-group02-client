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
            localStorage.setItem('selectedPiece', pieceId);

        } catch (error) {
            if(error.response.status === 409){
                alert(error.response.data);
            }
            else {
                alert(`Something went wrong while getting the possible moves: \n${handleError(error)}`);
            }
        }
    }

    // move piece
    async moveSelectedPiece(coords) {
        try {
            const requestBody = JSON.stringify({
                userId: JSON.parse(localStorage.getItem('user')).userId,
                move: { 'x' : coords[0], 'y' : coords[0] }
                // localStorage.getItem('selectedPiece')
            });
            const mapping = '/games/' + this.state.game.gameId.toString();
            const response = await api.post(mapping, requestBody);

            localStorage.setItem('game', JSON.stringify(response.data));
            localStorage.removeItem('selectedPiece');

        } catch (error) {
            if(error.response.status === 409){
                alert(error.response.data);
            }
            else {
                alert(`Something went wrong while trying to make a move: \n${handleError(error)}`);
            }
        }
    }

    // resign
    async resign() {
        try {
            const params = JSON.stringify({
                token: localStorage.getItem('token'),
            });
            const mapping = '/games/' + this.state.game.gameId.toString();

            const response = await api.put(mapping, {params: params});
            window.alert('You lost');

            localStorage.removeItem('game');
            localStorage.removeItem('selectedPiece');

        } catch (error) {
            if(error.response.status === 409){
                alert(error.response.data);
            }
            else {
                alert(`Something went wrong while trying to resign: \n${handleError(error)}`);
            }
        }
    }


    // resign
    async fetchGameStatus() {
        try {
            const parameters = JSON.stringify({
                userId: JSON.parse(localStorage.getItem('user')).userId,
            });
            const mapping = '/games/' + this.state.game.gameId.toString();

            const gameStatus = await api.get(mapping, {params: parameters});
            this.setState({ game : gameStatus });
            window.alert(JSON.stringify(this.state.game));

        } catch (error) {
            if(error.response.status === 409){
                alert(error.response.data);
            }
            else {
                alert(`Something went wrong while trying to get the game status: \n${handleError(error)}`);
            }
        }
    }

    render() {

        // fetch game state every 20 seconds TODO: make smaller intervals
        setInterval(async () => {
            this.fetchGameStatus();
        }, 20000);

        const game = JSON.parse(localStorage.getItem('game'));

        let opponent
        opponent = (game.playerWhite && game.playerBlack) ? (game.playerWhite.username ===
            JSON.parse(localStorage.getItem('user')).username ?
            game.playerBlack.username : game.playerWhite.username) : 'Error';

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
                                if (Number(localStorage.getItem('selectedPiece')) === pieceId) {
                                    pieceColor = '#0BD1FF';
                                }
                            })

                            let blueDot = false;
                            let coordsToMoveTo;

                            if (localStorage.getItem('possibleMoves')) {
                                JSON.parse(localStorage.getItem('possibleMoves')).forEach(function (coords) {
                                    if (coords.x === 1 + file && coords.y === 8 - rank) {
                                        blueDot = true;
                                        coordsToMoveTo = coords;
                                    }
                                })
                            }

                            return(
                                <Grid.Column
                                    width={2} style={{
                                        alignContent: 'center',
                                        background: color,
                                        height: '40px'
                                    }}
                                >
                                    {(pieceType) ? (
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
                                        />) : ((blueDot) ? (
                                        <Icon
                                            style={{
                                                marginTop: '15px',
                                                align: 'center',
                                                color: '#0BD1FF',
                                            }}
                                            name='circle'
                                            size='small'
                                            onClick={() => {
                                                this.moveSelectedPiece(coordsToMoveTo);
                                            }}
                                        />) : (''))
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
                        onClick={() => {
                            this.resign();
                        }}
                    >
                        Resign
                    </Button>
                </Grid.Column>
                <Grid.Column textAlign='center'>
                    <Button
                        style={gameButtonStyle}
                        onClick={() => {
                            this.fetchGameStatus();
                        }}
                    >
                        fetch game status
                    </Button>
                </Grid.Column>
            </Grid.Row>
        </Grid>
        );
    }
}

export default withRouter(Game);
