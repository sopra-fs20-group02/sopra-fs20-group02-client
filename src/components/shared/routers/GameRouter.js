import React from "react";
import styled from "styled-components";
import {Redirect, Route, Switch} from "react-router-dom";
import Game from "../../game/Lobby";
import Profile from "../../profile/Profile";
import Waiting from "../../game/Waiting";
import {GameGuard} from "../routeProtectors/GameGuard";
import GameEnded from "../../game/GameEnded";
import GameBoard from "../../game/GameBoard";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

class GameRouter extends React.Component {
  render() {
    /**
     * "this.props.base" is "/app" because as been passed as a prop in the parent of GameRouter, i.e., App.js
     */
    return (
      <Container>
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
      </Container>
    );
  }
}
/*
* Don't forget to export your component!
 */
export default GameRouter;
