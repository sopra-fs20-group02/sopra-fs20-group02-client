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
            selectedPiece: null
        };
    }

    async componentDidMount() {
        this.setState({gameId: this.props.location.state.gameId});
        console.log(this.props.location.state.gameId);
        const game = await fetchGameStatus(localStorage.getItem('userId'), this.props.location.state.gameId);
        this.setState({
            game: game
        });
        this.interval = setInterval(async () => {
            if (this.state.gameId){
                const gameStatusObject = await fetchGameStatus(localStorage.getItem('userId'), this.state.gameId);
                this.setState({game: gameStatusObject})
            }
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
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
                    userId: localStorage.getItem('userId')
                });
                const mapping = '/games/' + this.state.game.gameId.toString() + '/' + pieceId.toString();
                const response = await api.get(mapping, requestBody);

                this.setState({possibleMoves: JSON.stringify(response.data)});
                this.setState({selectedPiece: pieceId})

                // maybe add force update

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
                this.state.selectedPiece.toString();
            const response = await api.put(mapping, requestBody);

            this.setState({
                game: JSON.stringify(response.data)
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

    render() {

        const game = this.state.game;
        console.log(game);

        const opponent = (game.playerWhite && game.playerBlack) ? (game.playerWhite.userId ===
            localStorage.getItem('userId') ?
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

        // TODO: get rid of all the redundant localStorage accesses
        return (<div>test</div>);/*(
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
                                    if (this.state.selectedPiece === pieceId) {
                                        pieceColor = '#0BD1FF';
                                    }
                                })

                                let blueDot = false;
                                let coordsToMoveTo;

                                if (this.state.possibleMoves) {
                                    this.state.possibleMoves.forEach(function (coords) {
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
        );*/
    }
}

export default withRouter(GameBoard);
