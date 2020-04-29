import React from "react";
import { api, handleError } from '../../helpers/api';
import { withRouter } from 'react-router-dom';
import { Grid, Header, Icon } from "semantic-ui-react";
import Tile from './Tile';
import {
    gameStyle, gameHeaderStyle,
    chessBoardStyle, boardRankStyle,
    capturedPiecesStyle, gameButtonStyle, gameFooterStyle
} from "../../data/styles";
import {fetchGameStatus} from "../requests/fetchGameStatus";
import {Button} from "../../views/design/Button";

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
            displayMoves: false,
            selectedPiece: null,
            userId: localStorage.getItem('userId'),
            isWatching: null,
            isPlayerWhite: null
        };
        this.tileCallback = this.tileCallback.bind(this);
    }

    async componentDidMount() {
        this.setState({gameId: this.props.location.state.gameId});
        this.interval = setInterval(async () => {
            if (this.state.gameId){
                const gameStatusObject = await fetchGameStatus(localStorage.getItem('userId'), this.state.gameId);
                this.setState({game: gameStatusObject.data});
                this.setState({
                    isWatching: ( Number(this.state.userId) !== this.state.game.playerWhite.userId
                        && Number(this.state.userId) !== this.state.game.playerBlack.userId)
                });
                this.setState({
                    isPlayerWhite: Number(localStorage.getItem('userId')) === gameStatusObject.data.playerWhite.userId
                });
                if (this.state.game.gameStatus !== 'FULL'){
                    this.toLobby();
                }
            }
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    // gets all possible moves for the selected piece
    async getPossibleMoves(pieceId, pieceIsWhite) {
        if (!this.state.isWatching){

            if ((this.state.game.isWhiteTurn && pieceIsWhite &&
                this.state.game.playerWhite.userId === Number(this.state.userId)
                ) || (
                !this.state.game.isWhiteTurn && !pieceIsWhite &&
                this.state.game.playerBlack.userId === Number(this.state.userId)
            )) {
                try {
                    this.setState({displayMoves: true});
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
                    console.log(response.data);

                } catch (error) {
                    console.error(error)
                }
            }
        }
    }

    // moves the piece
    async moveSelectedPiece(x, y) {
        if (!this.state.isWatching){
            try {
                const requestBody = JSON.stringify({
                    x : x,
                    y : y
                });
                console.log(requestBody);
                const mapping = '/games/' + this.state.game.gameId + '/' +
                    this.state.selectedPiece.toString();
                const response = await api.put(mapping, requestBody);

                this.setState({
                    game: response.data,
                    selectedPiece: null,
                    blueDots: false,
                });


            } catch (error) {
                console.error(error)
            }
        }
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
            console.error(error)
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
            console.error(error)
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
        });

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

    async tileCallback(id, x, y, isWhiteTile){
        if (!this.state.displayMoves){
            await this.getPossibleMoves(id,isWhiteTile);
        }
        else {
            this.setState({displayMoves: false});
            this.setState({possibleMoves: null});
            for (let i = 0; i < this.state.possibleMoves.length; i++){
                if (
                    x === this.state.possibleMoves[i].x &&
                    y === this.state.possibleMoves[i].y
                ){
                    this.moveSelectedPiece(x,y)
                }
            }
        }
    }

    renderBoard(){
        let board = [];
        for (let y = 1; y <= 8; y++){
            let row = [];
            for (let x = 1; x <= 8; x++){
                row.push(
                    <Tile
                        x={x}
                        y={y}
                        game={this.state.game}
                        isPlayerWhite={this.state.isPlayerWhite}
                        click={this.tileCallback}
                        moves={this.state.possibleMoves}
                    />
                )
            }
            board.push(
                <Grid.Row style={boardRankStyle} >
                    {row}
                </Grid.Row>
            );
        }
        // flip board
        if (Number(this.state.game.playerWhite.userId) === Number(this.state.userId)){
            board = board.reverse();
        }

        return(
            <Grid style={chessBoardStyle} >
                {board}
            </Grid>
        )
    }

    render() {
        const game = this.state.game;
        if (game){
            return (
                <Grid style={gameStyle} centered>
                    {this.getHeader(game)}
                    {this.getCapturedPieces('opponent')}
                    {this.renderBoard()}
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
