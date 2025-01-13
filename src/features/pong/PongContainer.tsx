import React, { useMemo, useState } from "react";

import { Stage } from "@inlet/react-pixi";
import { useDispatch, useSelector } from "react-redux";

import {
  selectWinner,
  selectPlayers,
  selectStatus,
  selectConfig,
  selectButtons,
  selectBall,
  selectObstacles,
} from "./pongSlice";
import Pong from "./Pong";
import Instructions from "src/components/Instructions";
import { PingPongService } from "src/PingPongService";

type PageStates = "home" | "join_game" | "game";

export const PongApp = (props) => {
  const dispatch = useDispatch();

  const winner = useSelector(selectWinner);
  const players = useSelector(selectPlayers);
  const status = useSelector(selectStatus);
  const config = useSelector(selectConfig);
  const buttons = useSelector(selectButtons);
  const ball = useSelector(selectBall);
  const obstacles = useSelector(selectObstacles);
  const [page, setPage] = useState<PageStates>("home");
  const [gameId, setGameId] = useState("");
  const pingPongService = useMemo(() => {
    return new PingPongService();
  }, []);

  const pongContainerProps = {
    ball,
    config,
    buttons,
    players,
    status,
    winner,
    obstacles,
    dispatch,
    pingPongService,
  };

  const createGame = () => {
    const gameId = pingPongService.newGame();
    setGameId(gameId);
    setPage("game");
  };

  const joinGame = () => {
    if (gameId.length < 1) {
      console.log("Please enter game id");
      return;
    }
    pingPongService.joinGame(gameId);
    setPage("game");
  };

  return (
    <div className="appContainer">
      {page == "home" ? (
        <div>
          <button onClick={() => setPage("join_game")}>Join Game</button>
          <button onClick={createGame}>Create Game</button>
        </div>
      ) : null}
      {page == "join_game" ? (
        <div>
          <label htmlFor="gameid">Game ID:</label>
          <input
            id="gameid"
            onChange={(e) => setGameId(e.target.value)}
          ></input>
          <button onClick={joinGame}>Join</button>
        </div>
      ) : null}
      {page == "game" ? (
        <div>
          <div>Game ID: {gameId}</div>
          <Stage
            width={config.width}
            height={config.height}
            options={{ autoDensity: true, backgroundColor: config.boardColor }}
          >
            <Pong {...pongContainerProps} />
          </Stage>
          <Instructions />
        </div>
      ) : null}
    </div>
  );
};

export default PongApp;
