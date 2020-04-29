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

        this.pieceType = undefined;
        this.selected = false;

        for (let i  = 0; i < this.props.game.pieces.length; i ++){
            const piece = this.props.game.pieces[i];

            if (Number(piece.xcord) === this.props.x && Number(piece.ycord) === this.props.y){
                this.pieceType = 'chess ' + piece.pieceType.toLowerCase();
                this.isWhite = piece.color === "WHITE";
                this.id = piece.pieceId;
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
                alignContent: 'center',
                background: this.color,
                height: '40px',
                width: '40px'
            }} onClick={this.handleClick}>
                {
                    this.pieceType &&
                    <Icon
                        style={{
                            position: 'relative',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            color: this.selected ? '#0BD1FF' : (this.isWhite ? 'white' : 'black'),
                            textShadow: (this.isWhite && !this.selected) ?  '1px 0px #000000, -1px 0px #000000, 0px 1px #000000, 0px -1px #000000' : ' '
                        }}
                        name={this.pieceType}
                        size='large'
                    />
                }
                {
                    !this.pieceType && this.selected &&
                    <Icon
                        style={{
                            position: 'relative',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            align: 'center',
                            color: '#0BD1FF',
                        }}
                        name='circle'
                        size='small'
                    />
                }
            </div>
        )
    }
}
