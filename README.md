<p>
  <a href="https://github.com/sopra-fs20-group02/sopra-fs20-group02-client/actions">
      <img src="https://github.com/sopra-fs20-group02/sopra-fs20-group02-client/workflows/Deploy%20Project/badge.svg">
  </a>
  <a href="https://heroku-badge.herokuapp.com/?app=sopra-fs20-group-02-client">
      <img src="https://heroku-badge.herokuapp.com/?app=sopra-fs20-group-02-client">
  </a>
</p>

# Jess

## Introduction
We aimed to create a state of the art online mutliplayer chess game, called Jess, where users can easily create
and join games with different rules. Besides, there is an extensive user statistics page and a chat 
functionality. The main focus was implementing our own chess engine where all possible moves can 
be fetched from the [backend](https://github.com/sopra-fs20-group02/sopra-fs20-group02-server) and displayed to the user. This enables users with less knowledge about
the game to perform better. 

## Technologies
* Github 
* Heroku
* SonarQube
* Postman
* React JS
* JavaScript
* WebSocket
* REST


## Launch & Deployment
Open a terminal, go to the directory sopra-fs20-group02-client and run the command:
#### `npm run dev`

For production run `npm run build` instead of `npm run dev`.

## Illustrations
One can register to be a user by choosing a unique username and a password. After users have logged in,
they are forwarded to a game lobby. There, they can either create a new game, which then can be joined
by another user afterwards, join a random game to face off against an unknown opponent or choose a desired user
as the opponent from a list of already existing games. The user also has the option to play in Blitz mode.
While waiting for another player to join the game or while lingering on the game end page, random quotes fetched
from an external API are displayed to the user for entertainment.  

During a game, if it's the user's turn, he or she sees the movable pieces marked and can see the possible moves
of one of his or her pieces by selecting it. The captured pieces are displayed above and below the board.
There are also the options to resign from a game, in which case the resigning user loses, or to offer a draw
to the opponent, in which case the game either results in a draw if the opponent accepts the offer or continues
if the opponent rejects the offer.  

From the game lobby, the user can also go to the game stats page to view simple statistics, such as the number of wins,
losses, draws and the total and average time played, the number of opponent and own pieces captured, etc.
A logged in user also has the possibility to chat with other logged in users or to join a game in the view mode,
which allows users to watch others play a game.

## Roadmap
- Chess Engine: The possibility to play against a chess bot.
- Last Moves Feed: Display the last n moves.
- Replay Game History: Feature that allows replaying a game (as an animation).

## Authors
[Andrin Rehmann](https://github.com/andrinr) <br/>
[Dominic Schmidli](https://github.com/dschmidli) <br/>
[Michael Hodel](https://github.com/michaelhodel) <br/>
[Philippe Schmidli](https://github.com/pschmidli)

## Acknowledgement
Thanks to group 2 for creating such a great and nice game. Special thanks to our tutor [Moritz Eck](https://github.com/meck93) who provided support
and valuable feedback in all phases of our project. We all learned a lot and are looking forward to challenging each other in Jess.

## License
This project is licensed under the Apache License - see the [LICENSE.md](LICENSE.md) file for details.



