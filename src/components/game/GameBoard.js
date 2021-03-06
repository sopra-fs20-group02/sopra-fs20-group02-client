import React from "react";
import { api, handleError } from '../../helpers/api';
import { withRouter } from 'react-router-dom';
import { Grid, Header, Icon, Confirm } from "semantic-ui-react";
import Tile from './Tile';
import {
    gameHeaderStyle, boardRankStyle, saddlingHorsesStyle, buttonStyle,
    capturedPiecesStyle, gameButtonStyle, background
} from "../../data/styles";
import {fetchGameStatus} from "../requests/fetchGameStatus";
import {Button} from "../../views/design/Button";

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
            isPlayerWhite: null,
            open: false,
            movablePieces: []
        };
        this.tileCallback = this.tileCallback.bind(this);
        this.offerDraw = this.offerDraw.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    async componentDidMount() {
        this.setState({
            gameId: this.props.location.state.gameId
        });
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
                if (this.state.game.gameMode === 'BLITZ' && this.isMyTurn()) {
                    let time = localStorage.getItem('remainingTime');
                    localStorage.setItem('remainingTime', (time-1).toString());
                }
                if (this.isMyTurn()) { this.getMovablePieces()};
                if (localStorage.getItem('remainingTime') < 1) {
                    this.resign(true);
                }
                if (this.state.game.gameStatus !== 'FULL'){
                    if (!(gameStatusObject.data.gameStatus === 'WHITE_IN_CHECK' ||
                        gameStatusObject.data.gameStatus === 'BLACK_IN_CHECK')) {
                        this.endGame(false);
                    }
                }
                this.opponentIsOfferingDraw();
            }
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
        if(!this.state.isWatching && this.state.game.gameStatus === 'FULL') {
            this.resign(false);
        }
    }

    // fetches all movable pieces
    async getMovablePieces() {
        try {
            const params = JSON.stringify({
                userId: this.state.userId
            });
            const mapping = '/games/' + this.state.game.gameId.toString() + '/movable';
            const response = await api.put(mapping, params);
            this.setState({ movablePieces : response.data});

        } catch (error) {
            console.error(error)
        }
    }

    // checks if this piece is movable
    isMovable(x, y) {
        let isMovable = false;
        if (this.isMyTurn()) {
            const movablePieces = this.state.movablePieces;
            movablePieces.forEach(function (piece) {
                if (piece.xcord === x && piece.ycord === y) {
                    isMovable = true;
                }
            });
        }
        return isMovable;
    }

    // gets all possible moves for selected piece
    async getPossibleMoves(pieceId, pieceIsWhite) {
        if (!this.state.isWatching){

            if ((this.state.game.isWhiteTurn && pieceIsWhite &&
                this.state.game.playerWhite.userId === Number(this.state.userId)
                ) || (
                !this.state.game.isWhiteTurn && !pieceIsWhite &&
                this.state.game.playerBlack.userId === Number(this.state.userId)
            )) {
                try {
                    const requestBody = JSON.stringify({
                        userId: Number(this.state.userId)
                    });
                    const mapping = '/games/' + this.state.game.gameId + '/' + pieceId.toString();
                    const response = await api.get(mapping, requestBody);
                    this.setState({
                        displayMoves: true,
                        possibleMoves: response.data,
                        selectedPiece: pieceId,
                        blueDots: true
                    });

                } catch (error) {
                    console.error(error)
                }
            }
        }
    }

    // moves the selected piece
    async moveSelectedPiece(x, y) {
        if (!this.state.isWatching){
            try {
                const requestBody = JSON.stringify({
                    x : x,
                    y : y
                });
                const mapping = '/games/' + this.state.game.gameId + '/' +
                    this.state.selectedPiece.toString();
                const response = await api.put(mapping, requestBody);

                this.setState({
                    game: response.data,
                    selectedPiece: null,
                    blueDots: false,
                    movablePieces: []
                });
            } catch (error) {
                console.error(error)
            }
        }
    }

    // allows player to resign from game
    async resign(ranOutOfTime) {
        try {
            const requestBody = JSON.stringify({
                userId: this.state.userId
            });
            const mapping = '/games/' + this.state.game.gameId.toString();

            const response = await api.put(mapping, requestBody);
            this.endGame(ranOutOfTime);

        } catch (error) {
            console.error(error)
        }
    }

    // ends the game
    async endGame(ranOutOfTime) {
        this.props.history.push({
            pathname: '/game/end',
            state: {
                game: this.state.game,
                isWatching: this.state.isWatching,
                ranOutOfTime: ranOutOfTime
            }
        })
    }

    // allows player to offer draw
    async offerDraw() {
        try {
            const params = JSON.stringify({
                userId: this.state.userId
            });
            const mapping = '/games/' + this.state.game.gameId.toString() + '/draw';

            const response = await api.post(mapping, params);

        } catch (error) {
            console.error(error)
        }
    }

    // returns true if the opponent is offering draw and the offer is not denied
    opponentIsOfferingDraw() {
        if ((this.state.game.playerWhite.userId === Number(this.state.userId) && this.state.game.blackOffersDraw) ||
            (this.state.game.playerBlack.userId === Number(this.state.userId) && this.state.game.whiteOffersDraw)) {
            this.setState({open: true})
        }
    }

    // returns opponent name
    getOpponentName(game) {
        if (game.playerWhite && game.playerBlack) {
            if (game.playerWhite.userId === Number(this.state.userId)) {
                return game.playerBlack.username;
            } else {
                return game.playerWhite.username;
            }
        } else {
            return '';
        }
    }

    // allows canceling game
    async cancel(){
        this.setState({
            open: false
        });
        try {
            const params = JSON.stringify({
                userId: this.state.userId
            });
            const mapping = '/games/' + this.state.game.gameId.toString() + '/draw';

            const response = await api.put(mapping, params);

        } catch (error) {
            console.error(error)
        }
    }

    // boolean indicator for whose turn
    isMyTurn(){
        return ((this.state.game.isWhiteTurn && this.state.game.playerWhite.userId === Number(this.state.userId)) ||
            (!this.state.game.isWhiteTurn && this.state.game.playerBlack.userId === Number(this.state.userId)));
    }

    // return information on whose turn it is and the opponents name
    getHeader(game) {
        const opponent = this.getOpponentName(game);
        let header;
        if (!this.state.isWatching){
            if (this.isMyTurn()) {
                header = 'Your turn';
            } else {
                header = opponent + "'s turn";
            }
        }
        else{
            header = 'Watching: ' + game.playerWhite.username + ' (w) vs. ' + game.playerBlack.username + ' (b)'
        }

        return (
            <Header as='h3' style={gameHeaderStyle}>
                {header}
            </Header>
        );
    }

    // remaining time for blitz mode
    getBlitzInfo() {
        if (this.state.game.gameMode === 'BLITZ') {
            const minutes = '0' + String(Math.floor(localStorage.getItem('remainingTime') / 60));
            let seconds =  localStorage.getItem('remainingTime') - minutes * 60;
            seconds = seconds < 10 ? '0' + String(seconds) : String(seconds);
            const remainingTime =  (' ' + minutes + ':' + seconds)
            return (
                <Header as='h3' style={gameHeaderStyle}>
                    {' Remaining Time: ' + remainingTime}
                </Header>
            );
        } else {
            return null;
        }
    }

    // a list of the captured pieces
    getCapturedPieces(player) {
        let pieceColors;
        if (player === 'opponent') {
            if (this.state.game.playerWhite.userId === Number(this.state.userId)) {
                pieceColors = 'WHITE';
            } else {
                pieceColors = 'BLACK';
            }
        } else {
            if (this.state.game.playerWhite.userId === Number(this.state.userId)) {
                pieceColors = 'BLACK';
            } else {
                pieceColors = 'WHITE';
            }
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
                <div style={{height: '100%',width: '340px', borderRadius: '3px', backgroundColor: 'rgba(255, 255, 255, 0.2)'}}>
                {capturedPieces[0] && capturedPieces.map(piece => {
                    return (<Icon
                        style={{
                            align: 'center',
                            color: pieceColors.toLowerCase(),
                            textShadow: pieceColors.toLowerCase() === 'white' ?
                                '1px 0px #000000, -1px 0px #000000, 0px 1px #000000, 0px -1px #000000' : ''
                        }}
                        name={'chess ' + piece.toLowerCase()}

                    />)
                })}
                </div>
            </Grid.Row>
        )
    }

    // tile handling
    async tileCallback(id, x, y, isWhiteTile){
        if (!this.state.displayMoves){
            if (id){
                await this.getPossibleMoves(id,isWhiteTile);
            }
        }
        else {
            this.setState(
                {
                    displayMoves: false,
                    possibleMoves: null
                }
            );
            if (this.state.possibleMoves) {
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
    }

    // board handling
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
                        isMovable={this.isMovable(x, y)}
                    />
                )
            }
            board.push(
                <Grid.Row style={boardRankStyle} >
                    {row}
                </Grid.Row>
            );
        }
        // flips board
        if (Number(this.state.game.playerWhite.userId) === Number(this.state.userId)){
            board = board.reverse();
        }

        return(
            <Grid style={{
                width: '340px',
                height: '340px',
                margin: '0px',
                background: '#ffffff',
                boxShadow: this.isMyTurn() ?
                    '0px 40px 70px -50px #ff5e00, 0px 90px 100px -50px #A50200' :
                    '0px -40px 70px -50px #ff5e00, 0px -90px 100px -50px #A50200',
                padding: '10px',
                borderRadius: '3px',
            }} >
                {board}
            </Grid>
        )
    }

    render() {
        const game = this.state.game;
        if (game){
            return (
                <div style={background}>
                    <Grid centered>
                        {this.getHeader(game)}
                        {this.getBlitzInfo()}
                        {this.getCapturedPieces('opponent')}
                        {this.renderBoard()}
                        {this.getCapturedPieces('own')}
                        <Confirm
                            open={this.state.open}
                            cancelButton='deny'
                            confirmButton="accept"
                            content='Accept draw offer?'
                            onCancel={this.cancel}
                            onConfirm={this.offerDraw}
                        />
                        {!this.state.isWatching &&
                        <Grid.Row columns={1}>
                            <Grid.Column textAlign='center'>
                                <button className="ui inverted button" style={buttonStyle} onClick={() => {
                                    this.resign(false);
                                }}>
                                    Resign
                                </button>
                                <button className="ui inverted button" style={buttonStyle} onClick={() => {
                                    this.offerDraw();
                                }}>
                                    Offer draw
                                </button>
                            </Grid.Column>
                        </Grid.Row>
                        }
                        {this.state.isWatching &&
                        <Grid.Row columns={2}>
                            <Grid.Column textAlign='center'>
                                <Button
                                    style={gameButtonStyle}
                                    onClick={() => {
                                        this.props.history.push({
                                            pathname: '/lobby/main',
                                        })
                                    }}
                                >
                                    Lobby
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                        }
                    </Grid>
                </div>
                );
        }
        else{
            return (
                <div style={background}>
                    <Grid centered>
                        <Grid.Row style={saddlingHorsesStyle}>
                            <Header as='h3' style={gameHeaderStyle}>
                                saddling horses...
                            </Header>
                        </Grid.Row>
                    </Grid>
                </div>
            )
        }
    }
}

export default withRouter(GameBoard);
