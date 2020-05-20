import React from "react";
import {Redirect, Route} from "react-router-dom";
import Waiting from "../../game/Waiting";
import {GameGuard} from "../routeProtectors/GameGuard";
import GameEnded from "../../game/GameEnded";
import GameBoard from "../../game/GameBoard";

class GameRouter extends React.Component {
  render() {

    return (
      <div>
          <Route
              path="/game/wait"
              render={() => (
                  <GameGuard>
                      <Waiting />
                  </GameGuard>
              )}
          />
          <Route
              path="/game/play"
              render={() => (
                  <GameGuard>
                      <GameBoard/>
                  </GameGuard>
              )}
          />
          <Route
              path="/game/end"
              render={() => (
                  <GameGuard>
                      <GameEnded />
                  </GameGuard>
              )}
          />
          <Route
              path="/game"
              exact
              render={() => (
                  <Redirect to={"/game/wait"} />
              )}
          />
      </div>
    );
  }
}

export default GameRouter;
