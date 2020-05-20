import React from "react";
import {Icon} from "semantic-ui-react";
import { motion } from "framer-motion"
import {pieceStyleOne, pieceStyleTwo} from "../../data/styles";

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
            this.color = "#4f4f4f"
        }
        else{
            this.color = "white"
        }

        this.pieceType = undefined;
        this.id = undefined;
        this.selected = false;
        this.isInCheck = false;

        for (let i  = 0; i < this.props.game.pieces.length; i ++){
            const piece = this.props.game.pieces[i];

            if (Number(piece.xcord) === this.props.x && Number(piece.ycord) === this.props.y){
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

        let pieceColor = this.selected ? '#ff5e00' :
            (this.isInCheck ? '#ff0039' : (this.isWhite ? ('white') :  'black'));

        let shadow = (this.isWhite && !this.selected && !this.isInCheck) ?
            '1px 0px #000000, -1px 0px #000000, 0px 1px #000000, 0px -1px #000000 , ' : '';

        if (this.props.isMovable){
            shadow += '0 0 5px #ff5e00'
        } else{
            shadow += '0 0 0 #000'
        }

        return(
            <div style={{
                background: (!this.pieceType && this.selected) ? '#ff5e00' : this.color,
                height: '40px',
                width: '40px',
                border: (!this.pieceType && this.selected) ? '0.1px solid #fff' : '',
                boxSizing: 'border-box'
            }} onClick={this.handleClick}>
                {
                    this.pieceType &&
                    <motion.div whileHover={{ scale: 1.1 }} >
                        <Icon
                            style={{
                                position: 'relative',
                                top: '8px',
                                left: '2px',
                                color: pieceColor,
                                textShadow: shadow
                            }}
                            name={this.pieceType}
                            size='large'
                        />
                    </motion.div>
                }
                {
                    !this.pieceType && this.selected &&
                    <Icon
                        style={pieceStyleTwo}
                        name='circle'
                        size='mini'
                    />
                }
            </div>
        )
    }
}
