import React from "react";
import {Icon} from "semantic-ui-react";

export default class Tile extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        this.props.click(this.id, this.props.x, this.props.y, this.isWhite)
    }

    render(){

        if (this.props.x % 2 === 0 && this.props.y % 2 === 0 ||
            this.props.x % 2 === 1 && this.props.y % 2 === 1
        ){
            this.color = this.props.isPlayerWhite ? "white" : "#FF8998"
        }
        else{
            this.color = this.props.isPlayerWhite ? "#FF8998" : "white"
        }

        this.prevPieceType = this.pieceType ? this.pieceType : this.prevPieceType;

        if (this.prevPieceType){
            setInterval(
                () => {
                    this.prevPieceType = undefined
                }, 5000
            )
        }

        this.pieceType = undefined;
        this.selected = false;
        this.isInCheck = false;

        for (let i  = 0; i < this.props.game.pieces.length; i ++){
            const piece = this.props.game.pieces[i];

            if (Number(piece.xcord) === this.props.x && Number(piece.ycord) === this.props.y){
                this.prevPieceType = this.pieceType;
                this.pieceType = 'chess ' + piece.pieceType.toLowerCase();
                this.isWhite = piece.color === "WHITE";
                this.id = piece.pieceId;
            }
        }

        if (this.pieceType === 'chess king') {
            if ((this.props.game.gameStatus === 'BLACK_IN_CHECK' && !this.isWhite) ||
                (this.props.game.gameStatus === 'WHITE_IN_CHECK' && this.isWhite)) {
                this.isInCheck = true;
            }
        }

        if (this.props.moves){
            for (let i = 0; i < this.props.moves.length; i++){
                if (this.props.moves[i].x === this.props.x && this.props.moves[i].y === this.props.y){
                    this.selected = true;
                }
            }
        }

        return(
            <div style={{
                background: this.color,
                height: '40px',
                width: '40px',
            }} onClick={this.handleClick}>
                {
                    this.pieceType &&
                    <Icon
                        style={{
                            position: 'relative',
                            top: '8px',
                            left: '2px',
                            color: this.selected ? '#0BD1FF' : (this.isInCheck ? '#0BD1FF' : (this.isWhite ? 'white' : 'black')),
                            textShadow: (this.isWhite && !this.selected && !this.isInCheck) ?  '1px 0px #000000, -1px 0px #000000, 0px 1px #000000, 0px -1px #000000' : ' '
                        }}
                        name={this.pieceType}
                        size='large'
                    />
                }
                {
                    this.prevPieceType && !this.pieceType &&
                    <Icon
                        style={{
                            position: 'relative',
                            top: '8px',
                            left: '2px',
                            color: 'rgba(11, 209, 255, 0.3)',

                        }}
                        name={this.prevPieceType}
                        size='large'
                    />
                }
                {
                    !this.pieceType && this.selected &&
                    <Icon
                        style={{
                            position: 'relative',
                            top: '9px',
                            left: '2px',
                            color: '#0BD1FF',
                        }}
                        name='circle'
                        size='mini'
                    />
                }
            </div>
        )
    }
}
