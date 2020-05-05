import React from "react";
import {Icon} from "semantic-ui-react";
import {IconStyle, lobbyFooterStyle} from "../../data/styles";
import {useHistory, withRouter} from "react-router-dom";
import {api, handleError} from "../../helpers/api";

export class Footer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };
        this.logout = this.logout.bind(this);
        this.gamesStats = this.gamesStats.bind(this);
        this.scoreBoard = this.scoreBoard.bind(this);
    }

    async lobby(){
        this.props.history.push({
            pathname: `/lobby`
        });
    }
    // logs out user
    async logout() {
        console.log(this.context)
        try {
            const requestBody = JSON.stringify({
                userId: localStorage.getItem('userId')
            });
            const response = await api.put('/logout', requestBody);

        } catch(error) {
            console.error(error.messages)
        }
        localStorage.clear();
        this.props.history.push('/login');
    }


    // goes to user stats page
    async gamesStats() {
        try {
            const response = await api.get('/users/' + localStorage.getItem('userId'));
            const gamesStats = response.data.userStats;
            this.props.history.push({
                pathname: '/gamesStats',
                state: { gamesStats: gamesStats }
            })

        } catch (error) {
            alert(`Something went wrong while fetching the user stats: \n${handleError(error)}`);
        }
    }

    // goes to scoreboard page
    async scoreBoard() {
        try {
            const response = await api.get('/users');
            const users = response.data;
            this.props.history.push({
                pathname: '/scoreBoard',
                state: { users: users }
            })

        } catch (error) {
            alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
        }
    }

    render() {
        return(
            <div className="ui four column grid" style={lobbyFooterStyle}>
                <div className="column">
                    <Icon style={{
                        color: 'black',
                    }}
                        name='log out'
                        size='large'
                        color='#FF3377'
                        flipped='horizontally'
                        onClick={() => {
                            this.logout();
                        }}
                    />
                </div>
                <div className="column">
                    <Icon style={{
                        color: this.props.from === 'lobby' ? '#0BD1FF' : 'black',
                    }}
                        name='chess'
                        size='large'
                        color='#FF3377'
                        onClick={() => {
                            this.lobby();
                        }}
                    />
                </div>
                <div className="column">
                    <Icon style={{
                        color: this.props.from === 'stats' ? '#0BD1FF' : 'black',
                    }}
                        name='chart bar'
                        size='large'
                        color='#FF3377'
                        onClick={() => {
                            this.gamesStats();
                        }}
                    />
                </div>
                <div className="column">
                    <Icon style={{
                        color: this.props.from === 'scores' ? '#0BD1FF' : 'black',
                    }}
                        name='winner'
                        size='large'
                        color='#FF3377'
                        onClick={() => {
                            this.scoreBoard();
                        }}
                    />
                </div>
            </div>
        )
    }
}

export default withRouter(Footer);
