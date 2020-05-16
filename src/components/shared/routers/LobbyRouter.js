import React from "react";
import styled from "styled-components";
import {Redirect, Route} from "react-router-dom";
import {GameGuard} from "../routeProtectors/GameGuard";
import GamesStats from "../../profile/GamesStats";
import ScoreBoard from "../../profile/ScoreBoard";
import Lobby from "../../game/Lobby";
import Footer from "../../game/Footer";
import {background} from "../../../data/styles";
const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

class LobbyRouter extends React.Component {
  render() {
    /**
     * "this.props.base" is "/app" because as been passed as a prop in the parent of GameRouter, i.e., App.js
     */
    return (
        <Container>
            <Route
                path="/lobby/stats"
                render={() => (
                    <GameGuard>
                        <GamesStats />
                    </GameGuard>
                )}
            />
            <Route
                path="/lobby/scores"
                render={() => (
                    <GameGuard>
                        <ScoreBoard />
                    </GameGuard>
                )}
            />
            <Route
                path="/lobby/main"
                render={() => (
                    <GameGuard>
                        <Lobby/>
                    </GameGuard>
                )}
            />
            <Route
                path="/lobby"
                exact
                render={() => (
                    <Redirect to={"/lobby/main"} />
                )}
            />
            <Footer from={'lobby'} userStateCallback={this.props.userStateCallback}/>

        </Container>
    );
  }
}
/*
* Don't forget to export your component!
 */
export default LobbyRouter;
