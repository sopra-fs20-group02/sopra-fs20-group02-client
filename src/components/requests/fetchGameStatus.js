// update game status
import {api, handleError} from "../../helpers/api";

// fetches the game status
export const fetchGameStatus = async (userId, gameId) => {
  try {
    const parameters = JSON.stringify({
      userId: userId,
    });
    const mapping = '/games/' + gameId.toString();

    const gameStatus = await api.get(mapping, {params: parameters});

    return gameStatus;

  } catch (error) {
      console.log(error);
  }
};
