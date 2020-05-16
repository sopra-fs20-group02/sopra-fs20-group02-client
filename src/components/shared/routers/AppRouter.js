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
import LobbyRouter from "./LobbyRouter";
import Chat from "../../chat/Chat";

class AppRouter extends React.Component {

    constructor(){
        super();
        this.onLoginOrLogout = this.onLoginOrLogout.bind(this);
    }

    componentWillUnmount() {
        localStorage.clear();
    }

    onLoginOrLogout(){
        this.forceUpdate();
    }

    render() {
        return (
            <div>
                <Chat/>
                <BrowserRouter>
                    <Switch>
                        <Route
                            path="/lobby"
                            render={() => (
                                <GameGuard>
                                    <LobbyRouter userStateCallback={this.onLoginOrLogout}/>
                                </GameGuard>
                            )}
                        />
                        <Route
                            path="/game"
                            render={() => (
                                <GameGuard>
                                    <GameRouter />
                                </GameGuard>
                            )}
                        />
                        <Route
                            path="/login"
                            exact
                            render={() => (
                                <LoginGuard>
                                    <Login userStateCallback={this.onLoginOrLogout}/>
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
            </div>
        );
    }
}

export default AppRouter;
