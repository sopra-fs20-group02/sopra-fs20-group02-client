import React from "react";
import {Redirect, Route} from "react-router-dom";
import {GameGuard} from "../routeProtectors/GameGuard";
import GamesStats from "../../profile/GamesStats";
import ScoreBoard from "../../profile/ScoreBoard";
import Lobby from "../../game/Lobby";
import Footer from "../../game/Footer";

class LobbyRouter extends React.Component {
  render() {
    return (
        <div>
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

        </div>
    );
  }
}
export default LobbyRouter;
