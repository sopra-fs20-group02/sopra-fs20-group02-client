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
            userId: localStorage.getItem('userId'),
            isWatching: null
        };
    }

    async componentDidMount() {
        this.setState({gameId: this.props.location.state.gameId});
        this.interval = setInterval(async () => {
            if (this.state.gameId){
                const gameStatusObject = await fetchGameStatus(localStorage.getItem('userId'), this.state.gameId);
                this.setState({game: gameStatusObject.data})
                this.setState({
                    isWatching: ( Number(this.state.userId) !== this.state.game.playerWhite.userId
                        && Number(this.state.userId) !== this.state.game.playerBlack.userId)
                })
            }
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    // gets all possible moves for the selected piece
    async getPossibleMoves(pieceId, pieceColor) {
        if (!this.state.isWatching){
            if ((this.state.game.isWhiteTurn &&
                this.state.game.playerWhite.userId === Number(this.state.userId) &&
                pieceColor === 'white')  ||
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
    }

    // moves the piece
    async moveSelectedPiece(coords) {
        if (!this.state.isWatching){
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
    }

    // returns the piece
    getPiece(pieceColor, pieceType, pieceId, blueDotsActive, pieceInDanger, coordsToMoveTo) {
        return (<Icon
            style={{
                marginTop: '10px',
                paddingRight: '15px',
                align: 'center',
                color: (pieceInDanger && this.state.blueDots) ? 'red' : pieceColor,
                textShadow: pieceColor === 'white' ? '1px 0px #000000, -1px 0px #000000, 0px 1px #000000, 0px -1px #000000' : ''
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

    // returns a blue dot to indicate that the user can move his selected piece there
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

    // allows player to resign from game
    // TODO: test this implementation
    async resign() {
        try {
            const requestBody = JSON.stringify({
                userId: this.state.userId
            });
            const mapping = '/games/' + this.state.game.gameId.toString();

            const response = await api.put(mapping, requestBody);
            window.alert('You lost');
            this.toLobby();

        } catch (error) {
            if(error.response.status === 409){
                alert(error.response.data);
            }
            else {
                alert(`Something went wrong while trying to resign: \n${handleError(error)}`);
            }
        }
    }

    async toLobby() {
        this.props.history.push({
            pathname: '/lobby'
        })
    }

    // allows player to offer draw
    // TODO: implement this using the correct request
    async offerDraw() {
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

    // returns opponent name
    getOpponentName(game) {
        if (game.playerWhite && game.playerBlack) {
            if (game.playerWhite.userId === Number(this.state.userId)) {
                return game.playerWhite.username;
            } else {
                return game.playerBlack.username;
            }
        } else {
            return '';
        }
    }

    // return information on whose turn it is and the opponents name
    getHeader(game) {
        const opponent = this.getOpponentName(game);
        let header;
        if (!this.state.isWatching){
            if ((game.isWhiteTurn && game.playerWhite.userId === Number(this.state.userId)) ||
                (!game.isWhiteTurn && game.playerBlack.userId === Number(this.state.userId))) {
                header = 'Your turn';
            } else {
                header = opponent + "'s turn";
            }
        }
        else{
            header = 'Watch mode'
        }

        return (
            <Grid.Row style={{marginBottom: '0px'}}>
                <Header as='h3' style={gameHeaderStyle}>
                    {header}
                </Header>
            </Grid.Row>
        );
    }

    // returns information on the piece to display
    getPieceData(game, fileShift, fileSign, rankShift, rankSign, file, rank) {
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
            if (pieceColor === 'white') { pieceColor = 'white'; }
            if (this.state.selectedPiece === pieceId) {
                pieceColor = '#0BD1FF';
            }
        })
        return [pieceType, pieceColor, pieceId, pieceCoords];
    }

    // returns information needed for converting indices and rotating the board
    getRanksAndShifts(game) {
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
        return [fileShift, rankShift, fileSign, rankSign];
    }

    // returns information for displaying possible moves
    getPossibleMovesData(fileShift, fileSign, rankShift, rankSign, file, rank, pieceCoords) {
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
                if (pieceCoords) {
                    if (coords.x == pieceCoords[0] && coords.y ===  pieceCoords[1]) {
                        pieceInDanger = true;
                    }
                }
            })
        }
        const blueDotsActive = blueDot && this.state.blueDots;
        return [coordsToMoveTo, pieceInDanger, blueDotsActive];
    }

    getCapturedPieces(player) {
        let pieceColors;
        if (player === 'opponent') {
            if (this.state.game.playerWhite.userId === Number(this.state.userId)) {
                pieceColors = 'WHITE'; } else { pieceColors = 'BLACK'; }
        } else {
            if (this.state.game.playerWhite.userId === Number(this.state.userId)) {
                pieceColors = 'BLACK'; } else { pieceColors = 'WHITE'; }
        }

        let capturedPieces = [];
        this.state.game.pieces.forEach(function (piece) {
            if (piece.captured) {
                if (pieceColors === piece.color) {
                    capturedPieces.push(piece.pieceType);
                }
            }
        })

        return (
            <Grid.Row style={capturedPiecesStyle}>
                {capturedPieces[0] && capturedPieces.map(piece => {
                    return (<Icon
                        style={{
                            align: 'center',
                            color: pieceColors.toLowerCase(),
                            textShadow: pieceColors.toLowerCase() === 'white' ?
                                '1px 0px #000000, -1px 0px #000000, 0px 1px #000000, 0px -1px #000000' : ''
                        }}
                        name={'chess ' + piece.toLowerCase()}
                        size='large'
                    />)
                })}
            </Grid.Row>
        )
    }

    render() {

        const game = this.state.game;

        if (game){
            const opponent = (game.playerWhite && game.playerBlack) ? (game.playerWhite.userId ===
            localStorage.getItem('userId') ?
                game.playerBlack.username : game.playerWhite.username) : '';

            const [fileShift, rankShift, fileSign, rankSign] = this.getRanksAndShifts(game);

            return (
                <Grid style={gameStyle} centered>
                    {this.getHeader(game)}
                    {this.getCapturedPieces('opponent')}
                    <Grid style={chessBoardStyle} >
                        {Array.from(Array(8).keys()).map((rank) => {
                            return (
                                <Grid.Row style={boardRankStyle} >
                                    {Array.from(Array(8).keys()).map((file) => {
                                        const color = file % 2 == rank % 2 ? 'white' : '#FF8998';

                                        const [pieceType, pieceColor, pieceId, pieceCoords] = this.getPieceData(
                                            game, fileShift, fileSign, rankShift, rankSign, file, rank
                                        );

                                        const [coordsToMoveTo, pieceInDanger, blueDotsActive] = this.getPossibleMovesData(
                                            fileShift, fileSign, rankShift, rankSign, file, rank, pieceCoords
                                        );

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
                    {!this.state.isWatching &&
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
                    }
                    {this.state.isWatching &&
                        <Grid.Row columns={2} style={gameFooterStyle}>
                            <Grid.Column textAlign='center'>
                                <Button
                                    style={gameButtonStyle}
                                    onClick={() => {
                                        this.toLobby();
                                    }}
                                >
                                    Lobby
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                    }
                </Grid>
                );
        }
        else{
            return (
                <Grid style={gameStyle} centered>
                    <Grid.Row style={{
                        marginBottom: '270px',
                        marginTop: '270px'
                    }}>
                        <Header as='h3' style={gameHeaderStyle}>
                            fetching...
                        </Header>
                    </Grid.Row>
                </Grid>
            )
        }
    }
}

export default withRouter(GameBoard);
