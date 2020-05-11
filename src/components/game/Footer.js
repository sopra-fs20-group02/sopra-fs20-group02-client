import React from "react";
import {Icon} from "semantic-ui-react";
import {FooterStyle} from "../../data/styles";
import {withRouter} from "react-router-dom";
import {api, handleError} from "../../helpers/api";
import { motion } from "framer-motion"

export class Footer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pathname: props.location.pathname
        };
        this.logout = this.logout.bind(this);
        this.gamesStats = this.gamesStats.bind(this);
        this.scoreBoard = this.scoreBoard.bind(this);
    }

    async lobby(){
        this.props.history.push({
            pathname: `/lobby/main`
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
            const requestBody = JSON.stringify({
                userId: localStorage.getItem('userId')
            });
            const response1 = await api.get('/users/' + localStorage.getItem('userId') + '/gameHistory');
            const response2 = await api.get('/users/' + localStorage.getItem('userId'));
            const gamesStats = response2.data.userStats;
            const gameHistory = response1.data;
            this.props.history.push({
                pathname: '/lobby/stats',
                state: {
                    gamesStats: gamesStats,
                    gameHistory: gameHistory
                }
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
                pathname: '/lobby/scores',
                state: { users: users }
            })

        } catch (error) {
            alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
        }
    }

    render() {
        return(
            <div style={FooterStyle}>
                <div className="ui four column grid " >
                    <div className="column">
                        <motion.div whileHover={{ scale: 1.1 }} >
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
                        </motion.div>
                    </div>
                    <div className="column">
                        <motion.div whileHover={{ scale: 1.1 }} >
                            <Icon style={{
                                color: window.location.href.includes('lobby/main') ? '#ff5e00' : 'black',
                            }}
                                  name='chess'
                                  size='large'
                                  color='#FF3377'
                                  onClick={() => {
                                      this.lobby();
                                  }}
                            />
                        </motion.div>
                    </div>
                    <div className="column">
                        <motion.div whileHover={{ scale: 1.1 }} >
                            <Icon style={{
                                color: window.location.href.includes('lobby/stats') ? '#ff5e00' : 'black',
                            }}
                                  name='chart bar'
                                  size='large'
                                  color='#FF3377'
                                  onClick={() => {
                                      this.gamesStats();
                                  }}
                            />
                        </motion.div>
                    </div>
                    <div className="column">
                        <motion.div whileHover={{ scale: 1.1 }} >
                            <Icon style={{
                                color: window.location.href.includes('lobby/scores') ? '#ff5e00' : 'black',
                            }}
                                  name='winner'
                                  size='large'
                                  color='#FF3377'
                                  onClick={() => {
                                      this.scoreBoard();
                                  }}
                            />
                        </motion.div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Footer);
