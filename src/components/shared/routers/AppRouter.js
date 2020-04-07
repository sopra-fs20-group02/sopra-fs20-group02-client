import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { GameGuard } from "../routeProtectors/GameGuard";
import GameRouter from "./GameRouter";
import { LoginGuard } from "../routeProtectors/LoginGuard";
import Login from "../../login/Login";
import Game from "../../game/Game";
import Registration from "../../registration/Registration";

class AppRouter extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <div>
                        <Route
                            path="/lobby"
                            render={() => (
                                <GameGuard>
                                    <GameRouter base={"/lobby"} />
                                </GameGuard>
                            )}
                        />
                        <Route
                            path="/game"
                            render={() => (
                                <Game />
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
                                <Redirect to={"/lobby"} />
                                )}
                        />
                    </div>
                </Switch>
            </BrowserRouter>
        );
    }
}

export default AppRouter;
