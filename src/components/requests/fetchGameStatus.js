// update game status
import {api, handleError} from "../../helpers/api";

export const fetchGameStatus = async (userId, gameId) => {
  try {
    const parameters = JSON.stringify({
      userId: JSON.parse(localStorage.getItem('user')).userId,
    });
    const mapping = '/games/' + this.state.game.gameId.toString();

    const gameStatus = await api.get(mapping, {params: parameters});

    return gameStatus;

  } catch (error) {
    if (error.response.status === 409) {
      alert(error.response.data);
    } else {
      alert(`Something went wrong while trying to get the game status: \n${handleError(error)}`);
    }
  }
};
