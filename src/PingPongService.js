import axios from "axios";
import store from "./app/store";
import { moveOpponent, receiveBallMovement } from "./features/pong/pongSlice";

export class PingPongService {
  constructor() {
    // axios.defaults.withCredentials = true;
    this.hostUrl = "http://127.0.0.1:5000";
    this.playerName = null;
    this.gameId = null;
  }

  newGame() {
    this.playerName = "player1";
    this.gameId = Date.now().toString();

    this.playerEventSource = new EventSource(
      this.hostUrl +
        `/streamPlayer?playerName=${this.playerName}&gameId=${this.gameId}`
    );
    // attaching a handler to receive message events
    this.playerEventSource.addEventListener("message", (e) => {
      this.handleMoveEvent(e);
    });

    return this.gameId;
  }

  joinGame(gameId) {
    this.playerName = "player2";
    this.gameId = gameId;

    this.playerEventSource = new EventSource(
      this.hostUrl +
        `/streamPlayer?playerName=${this.playerName}&gameId=${this.gameId}`
    );
    // attaching a handler to receive message events
    this.playerEventSource.addEventListener("message", (e) => {
      this.handleMoveEvent(e);
    });

    this.ballEventSource = new EventSource(
      this.hostUrl + `/streamBall?gameId=${this.gameId}`
    );
    // attaching a handler to receive message events
    this.ballEventSource.addEventListener("message", (e) => {
      this.handleBallEvent(e);
    });
  }

  handleMoveEvent(event) {
    // console.log("Move Event", event);
    const obj = JSON.parse(event.data);
    store.dispatch(moveOpponent({ y: obj.y }));
  }

  handleBallEvent(event) {
    // console.log("Ball Event", event);
    const obj = JSON.parse(event.data);
    const myScore =
      this.playerName == "player1" ? obj.player1Score : obj.player2Score;
    const otherScore =
      this.playerName == "player2" ? obj.player1Score : obj.player2Score;
    store.dispatch(
      receiveBallMovement({
        x: obj.x,
        y: obj.y,
        winner: obj.winner,
        status: obj.status,
        myScore: myScore,
        otherScore: otherScore,
        obstacles: obj.obstacles,
      })
    );
  }

  movePaddle(y) {
    axios.post(this.hostUrl + "/movePlayer", {
      y: y,
      gameId: this.gameId,
      playerName: this.playerName,
    });
  }

  moveBall(x, y, status, winner, player1Score, player2Score, obstacles) {
    if (this.playerName == "player1") {
      axios.post(this.hostUrl + "/moveBall", {
        x: x,
        y: y,
        gameId: this.gameId,
        status,
        winner,
        player1Score,
        player2Score,
        obstacles,
      });
    }
  }
}
