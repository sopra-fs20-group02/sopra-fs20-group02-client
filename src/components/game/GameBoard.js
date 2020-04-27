import React from "react";
import { api, handleError } from '../../helpers/api';
import { withRouter } from 'react-router-dom';
import { Grid, Button, Header, Icon } from "semantic-ui-react";
import {
    gameStyle, gameButtonStyle, gameHeaderStyle, opponentStyle,
    chessBoardStyle, boardRankStyle, quoteStyle, gameFooterStyle,
    capturedPiecesStyle
} from "../../data/styles";
import {fetchGameStatus} from "../requests/fetchGameStatus";

// TODO: use state or functional component instead of localStorage !

class GameBoard extends React.Component {
    constructor() {
        super();
        this.state = {
            pieces: [
                'chess bishop', 'chess king', 'chess knight',
                'chess pawn', 'chess queen', 'chess rook'
            ],
            game: null,
            gameId: null,
            possibleMoves: null,
            selectedPiece: null,
            userId: localStorage.getItem('userId')
        };
    }

    async componentDidMount() {
        this.setState({gameId: this.props.location.state.gameId});
        this.interval = setInterval(async () => {
            if (this.state.gameId){
                const gameStatusObject = await fetchGameStatus(localStorage.getItem('userId'), this.state.gameId);
                this.setState({game: gameStatusObject.data})
            }
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    // get all possible moves for selected piece
    async getPossibleMoves(pieceId, pieceColor) {
        if ((this.state.game.isWhiteTurn &&
            this.state.game.playerWhite.userId === Number(this.state.userId) &&
            pieceColor === 'grey')  ||
            (!this.state.game.isWhiteTurn &&
            this.state.game.playerBlack.userId === Number(this.state.userId) &&
            pieceColor === 'black')) {
            try {
                const requestBody = JSON.stringify({
                    userId: Number(this.state.userId)
                });
                const mapping = '/games/' + this.state.game.gameId + '/' + pieceId.toString();
                const response = await api.get(mapping, requestBody);

                this.setState({
                    possibleMoves: response.data,
                    selectedPiece: pieceId,
                    blueDots: true
                });

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
                x : coords.x,
                y : coords.y
            });
            const mapping = '/games/' + this.state.game.gameId + '/' +
                this.state.selectedPiece.toString();
            const response = await api.put(mapping, requestBody);

            this.setState({
                game: response.data,
                selectedPiece: null,
                blueDots: false,
            });


        } catch (error) {
            if(error.response.status === 409){
                alert(error.response.data);
            }
            else {
                alert(`Something went wrong while trying to make a move: \n${handleError(error)}`);
            }
        }
    }

    getPiece(pieceColor, pieceType, pieceId, blueDotsActive, pieceInDanger, coordsToMoveTo) {
        return (<Icon
            style={{
                marginTop: '10px',
                paddingRight: '15px',
                align: 'center',
                color: pieceInDanger ? 'red' : pieceColor,
            }}
            name={pieceType}
            size='large'
            onClick={() => {
                if (!pieceInDanger) {
                    this.getPossibleMoves(pieceId, pieceColor);
                } else {
                    this.moveSelectedPiece(coordsToMoveTo);
                }
            }}
        />)
    }

    getBlueDot(coordsToMoveTo) {
        return (<Icon
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
        />)
    }

    // resign
    // TODO
    async resign() {
        try {
            const params = JSON.stringify({
                token: localStorage.getItem('token'),
            });
            const mapping = '/games/' + this.state.game.gameId.toString();

            const response = await api.put(mapping, {params: params});
            window.alert('You lost');

        } catch (error) {
            if(error.response.status === 409){
                alert(error.response.data);
            }
            else {
                alert(`Something went wrong while trying to resign: \n${handleError(error)}`);
            }
        }
    }

    async offerDraw() {
        // TODO: use correct request
        try {
            const params = JSON.stringify({
                token: localStorage.getItem('token'),
            });
            const mapping = '/games/' + this.state.game.gameId.toString();

            const response = await api.put(mapping, {params: params});
            window.alert('You lost');

        } catch (error) {
            if(error.response.status === 409){
                alert(error.response.data);
            }
            else {
                alert(`Something went wrong while trying to offer draw: \n${handleError(error)}`);
            }
        }
    }

    getHeader(game) {
        const opponent = (game.playerWhite && game.playerBlack) ? (game.playerWhite.userId === Number(this.state.userId) ?
            game.playerWhite.username : game.playerBlack.username) : '';
        let header;
        header = ((game.isWhiteTurn && game.playerWhite.userId === Number(this.state.userId)) ||
                (!game.isWhiteTurn && game.playerBlack.userId === Number(this.state.userId))) ?
                'Your turn' : opponent + "'s turn"
        return (
            <Grid.Row style={{marginBottom: '0px'}}>
                <Header as='h3' style={gameHeaderStyle}>
                    {header}
                </Header>
            </Grid.Row>
        );
    }

    // TODO: make this work (not yet tested)
    getCapturedPieces(player) {
        const pieceColors = this.state.game.playerWhite.userId === Number(this.state.userId) ? 'WHITE' : 'BLACK';
        let capturedPieces = [];
        this.state.game.pieces.forEach(function (piece) {
            if (piece.captured) {
                if (player === 'opponent') {
                    if (pieceColors !== piece.color) {
                        capturedPieces.push(piece);
                    }
                } else {
                    if (pieceColors === piece.color) {
                        capturedPieces.push(piece);
                    }
                }
            }
        })

        return (
            <Grid.Row style={capturedPiecesStyle}>
                {capturedPieces.map(piece => {
                    return (<Icon
                        style={{
                            align: 'center',
                            color: pieceColors,
                        }}
                        name={piece}
                    />)
                })}
            </Grid.Row>
        )
    }

    render() {

        const game = this.state.game;

        if (game){
            const opponent = (game.playerWhite && game.playerBlack) ? (game.playerWhite.userId === Number(this.state.userId) ?
                game.playerBlack.username : game.playerWhite.username) : '';

            let fileShift;
            let rankShift;
            let fileSign;
            let rankSign;

            if (game.playerWhite.userId === Number(this.state.userId)) {
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
                    {this.getHeader(game)}
                    {this.getCapturedPieces('opponent')}
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
                                        let pieceCoords;
                                        game.pieces.forEach( (piece) => {
                                            if (piece.xcord === fileShift + fileSign * file &&
                                                piece.ycord === rankShift + rankSign * rank) {
                                                pieceType = 'chess ' + piece.pieceType.toLowerCase();
                                                pieceColor = piece.color.toLowerCase();
                                                pieceId = piece.pieceId;
                                                pieceCoords = [piece.xcord, piece.ycord]
                                            }
                                            if (pieceColor === 'white') { pieceColor = 'grey'; }
                                            if (this.state.selectedPiece === pieceId) {
                                                pieceColor = '#0BD1FF';
                                            }
                                        })

                                        let blueDot = false;
                                        let coordsToMoveTo = false
                                        let pieceInDanger = false

                                        if (this.state.possibleMoves) {
                                            this.state.possibleMoves.forEach(function (coords) {
                                                if (coords.x === fileShift + fileSign * file &&
                                                    coords.y === rankShift + rankSign * rank) {
                                                    blueDot = true;
                                                    coordsToMoveTo = coords;
                                                }
                                                console.log(pieceCoords);
                                                if (pieceCoords) {
                                                    if (coords.x == pieceCoords[0] && coords.y ===  pieceCoords[1]) {
                                                        pieceInDanger = true;
                                                    }
                                                }
                                            })
                                        }
                                        if (pieceInDanger) {console.log(pieceCoords);}

                                        const blueDotsActive = blueDot && this.state.blueDots;

                                        return(
                                            <Grid.Column
                                                width={2} style={{
                                                    alignContent: 'center',
                                                    background: color,
                                                    height: '40px'
                                                }}
                                            >
                                                {(pieceType) ? (
                                                    this.getPiece(
                                                        pieceColor, pieceType, pieceId, blueDotsActive,
                                                        pieceInDanger, coordsToMoveTo
                                                    )
                                                ) : ((blueDotsActive) ? (
                                                    this.getBlueDot(coordsToMoveTo)
                                                ) : (''))}
                                            </Grid.Column>
                                        )
                                    })}
                                </Grid.Row>
                            )
                        })}
                    </Grid>
                    {this.getCapturedPieces('own')}
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
                                    this.offerDraw();
                                }}
                            >
                                Offer draw
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                );
        }
        else{
            return (<div>fetching...</div>)
        }
    }
}

export default withRouter(GameBoard);
