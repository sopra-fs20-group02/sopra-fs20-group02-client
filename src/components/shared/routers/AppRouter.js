import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { GameGuard } from "../routeProtectors/GameGuard";
import GameRouter from "./GameRouter";
import { LoginGuard } from "../routeProtectors/LoginGuard";
import Login from "../../login/Login";
import Game from "../../game/GameBoard";
import Registration from "../../registration/Registration";
import Waiting from "../../game/Waiting";
import Lobby from "../../game/Lobby";
import GameEnded from "../../game/GameEnded";
import GamesStats from "../../profile/GamesStats";
import ScoreBoard from "../../profile/ScoreBoard";

class AppRouter extends React.Component {
    render() {
        return (

            <BrowserRouter>
                <Switch>
                    <Route
                        path="/lobby"
                        render={() => (
                            <GameGuard>
                                <Lobby/>
                            </GameGuard>
                        )}
                    />
                    <Route
                        path="/game"
                        render={() => (
                            <GameGuard>
                                <Game />
                            </GameGuard>
                        )}
                    />
                    <Route
                        path="/waiting"
                        render={() => (
                            <GameGuard>
                                <Waiting />
                            </GameGuard>
                        )}
                    />
                    <Route
                        path="/gamesStats"
                        render={() => (
                            <GameGuard>
                                <GamesStats />
                            </GameGuard>
                        )}
                    />
                    <Route
                        path="/scoreBoard"
                        render={() => (
                            <GameGuard>
                                <ScoreBoard />
                            </GameGuard>
                        )}
                    />
                    <Route
                        path="/ended"
                        render={() => (
                            <GameGuard>
                            <GameEnded />
                            </GameGuard>
                        )}
                    />
                    <Route
                        path="/login"
                        exact
                        render={() => (
                            <LoginGuard>
                                <Login />
                            </LoginGuard>
                        )}
                    />
                    <Route
                        path="/registration"
                        exact
                        render={() => (
                            <Registration />
                        )}
                    />
                    <Route
                        path="/"
                        exact
                        render={() => (
                            <Redirect to={"/login"} />
                            )}
                    />
                </Switch>
            </BrowserRouter>
        );
    }
}

export default AppRouter;
