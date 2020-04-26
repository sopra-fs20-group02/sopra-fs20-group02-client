import React from "react";
import { api, handleError } from '../../helpers/api';
import { withRouter } from 'react-router-dom';
import { Grid, Button, Header, Icon } from "semantic-ui-react";
import {
    gameStyle, gameButtonStyle, gameHeaderStyle, opponentStyle,
    chessBoardStyle, boardRankStyle, quoteStyle, gameFooterStyle,
    capturedPiecesStyle
} from "../../data/styles";

// TODO: use state or functional component instead of localStorage !

class Game extends React.Component {
    constructor() {
        super();
        this.state = {
            userId: JSON.parse(localStorage.getItem('user')).userId,
            pieces: [
                'chess bishop', 'chess king', 'chess knight',
                'chess pawn', 'chess queen', 'chess rook'
            ],
            game: JSON.parse(localStorage.getItem('game')),
        };
    }

    // get all possible moves for selected piece
    async getPossibleMoves(pieceId, pieceColor) {
        if ((this.state.game.isWhiteTurn &&
            this.state.game.playerWhite.userId === this.state.userId &&
            pieceColor === 'grey')  ||
            (!this.state.game.isWhiteTurn &&
            this.state.game.playerBlack.userId === this.state.userId &&
            pieceColor === 'black')) {
            try {
                const requestBody = JSON.stringify({
                    userId: JSON.parse(localStorage.getItem('user')).userId
                });
                const mapping = '/games/' + this.state.game.gameId.toString() + '/' + pieceId.toString();
                const response = await api.get(mapping, requestBody);

                localStorage.setItem('possibleMoves', JSON.stringify(response.data));
                localStorage.setItem('selectedPiece', pieceId);
                window.location.reload();

            } catch (error) {
                if(error.response.status === 409){
                    alert(error.response.data);
                }
                else {
                    alert(`Something went wrong while getting the possible moves: \n${handleError(error)}`);
                }
            }
        }
    }

    // move piece
    async moveSelectedPiece(coords) {
        try {
            const requestBody = JSON.stringify({
                x : coords[0],
                y : coords[1]
            });
            const mapping = '/games/' + this.state.game.gameId.toString() + '/' +
                localStorage.getItem('selectedPiece').toString();
            const response = await api.put(mapping, requestBody);

            localStorage.setItem('game', JSON.stringify(response.data));
            localStorage.removeItem('selectedPiece');
            window.location.reload();

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


    async test() {

    }

    render() {

        // fetch game state every 10 seconds TODO: make smaller intervals
        setInterval(async () => {
            this.fetchGameStatus.bind(this);
        }, 10000);

        const game = JSON.parse(localStorage.getItem('game'));

        let opponent
        opponent = (game.playerWhite && game.playerBlack) ? (game.playerWhite.username ===
            JSON.parse(localStorage.getItem('user')).username ?
            game.playerBlack.username : game.playerWhite.username) : '';

        let fileShift;
        let rankShift;
        let fileSign;
        let rankSign;

        if (this.state.game.playerWhite.userId === this.state.userId) {
            fileShift = 1;
            rankShift = 8;
            fileSign = 1;
            rankSign = -1;
        } else {
            fileShift = 8;
            rankShift = 1;
            fileSign = -1;
            rankSign = 1;
        }

        return (
        <Grid style={gameStyle} centered>
            <Grid.Row style={{marginBottom: '0px'}}>
                <Header as='h4' style={gameHeaderStyle}>
                    Playing against
                </Header>
            </Grid.Row>
            <Grid.Row style={{marginTop: '0px'}}>
                <Header as='h2' style={opponentStyle}>
                    {opponent}
                </Header>
            </Grid.Row>
            <Grid.Row style={capturedPiecesStyle}>
                {['chess king', 'chess pawn'].map(piece => {
                    return (<Icon // TODO: this is only mockup piece
                        style={{
                            align: 'center',
                            color: 'grey',
                        }}
                        name={piece}
                    />)
                })}
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
                                    if (piece.xcord === fileShift + fileSign * file &&
                                        piece.ycord === rankShift + rankSign * rank) {
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
                                        if (coords.x === fileShift + fileSign * file &&
                                            coords.y === rankShift + rankSign * rank) {
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
                                                    this.getPossibleMoves(pieceId, pieceColor);
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
            <Grid.Row style={capturedPiecesStyle}>
                {['chess king', 'chess pawn'].map(piece => {
                    return (<Icon // TODO: this is only mockup piece
                        style={{
                            align: 'center',
                            color: 'black',
                        }}
                        name={piece}
                    />)
                })}
            </Grid.Row>
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
                            this.test();
                        }}
                    >
                        Test
                    </Button>
                </Grid.Column>
            </Grid.Row>
        </Grid>
        );
    }
}

export default withRouter(Game);
