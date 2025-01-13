import React, { useEffect } from "react";
import * as PIXI from "pixi.js";
import { Container, Text, useApp, useTick } from "@inlet/react-pixi";

import Ball from "./Ball";
import Button from "./Button";
import Paddle from "./Paddle";

import {
  startGame,
  pauseGame,
  resumeGame,
  endGame,
  restartGame,
  keyUp,
  movePaddleUp,
  movePaddleDown,
  moveBall,
} from "./pongSlice";

export default function Pong(props) {
  const app = useApp();

  const {
    winner,
    players,
    status,
    config,
    buttons,
    ball,
    obstacles,
    dispatch,
    pingPongService,
  } = props;

  const tick = () => {
    if (!winner) {
      dispatch(moveBall());
    }
  };

  const onKeyUp = (event: KeyboardEvent) => {
    dispatch(keyUp(event.key));
  };

  const onKeyDown = (event: KeyboardEvent) => {
    switch (event.code) {
      case "Escape":
        // ESC - Pause the game
        dispatch(pauseGame());
        app.ticker.remove(tick);
        break;

      case "KeyA": // A
        // Move the left paddle up
        dispatch(movePaddleUp("left"));
        pingPongService.movePaddle(players["left"]["y"]);
        break;
      case "KeyZ": // Z
        // Move the left paddle down
        dispatch(movePaddleDown("left"));
        pingPongService.movePaddle(players["left"]["y"]);
        break;
      case "ArrowUp": // Arrow Up Key
        // Move the left paddle up
        dispatch(movePaddleUp("left"));
        pingPongService.movePaddle(players["left"]["y"]);
        break;
      case "ArrowDown": //Arrow down key
        // Move the left paddle down
        dispatch(movePaddleDown("left"));
        pingPongService.movePaddle(players["left"]["y"]);
        break;
      default:
        return; // Do nothing
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      app.ticker.remove(tick);
    };
  });

  const cResumeGame = () => {
    // Resume the ticker
    app.ticker.add(tick);
    dispatch(resumeGame());
  };

  const cRestartGame = () => {
    // Restart the ticker
    app.ticker.add(tick);
    dispatch(restartGame());
  };

  useTick((delta) => {
    if (
      !winner &&
      status === "playing" &&
      pingPongService.playerName == "player1"
    ) {
      dispatch(moveBall());
    } else if (winner) {
      dispatch(endGame());
      app.ticker.remove(tick);
    }

    if (pingPongService.playerName == "player1") {
      pingPongService.moveBall(
        ball.x,
        ball.y,
        status,
        winner?.position ?? "none",
        pingPongService.playerName == "player1"
          ? players["left"].score
          : players["right"].score,
        pingPongService.playerName == "player2"
          ? players["left"].score
          : players["right"].score,
        obstacles
      );
    }
  });

  const start = () => {
    dispatch(startGame());
    app.ticker.add(tick);
  };

  return (
    <Container>
      <Text
        text={players.left.score.toString()}
        anchor={0.5}
        x={config.width / 4}
        y={150}
        style={
          new PIXI.TextStyle({
            fontSize: 60,
            fill: "#ffffff",
            letterSpacing: 10,
          })
        }
      />
      <Text
        text={players.right.score.toString()}
        anchor={0.5}
        x={(config.width / 4) * 3}
        y={150}
        style={
          new PIXI.TextStyle({
            fontSize: 60,
            fill: "#ffffff",
            letterSpacing: 10,
          })
        }
      />
      <Paddle player={players.left} />
      <Paddle player={players.right} />
      {obstacles.map((ob) => (
        <Paddle player={{ ...ob, position: "middle" }}></Paddle>
      ))}
      {status === "pre-start" && (
        <>
          <Text
            text="PONG!"
            anchor={0.5}
            x={config.width / 2}
            y={50}
            isSprite
            style={
              new PIXI.TextStyle({
                align: "center",
                fontFamily: "Futura, sans-serif",
                fontSize: 40,
                fill: "#ffffff",
                letterSpacing: 10,
              })
            }
          />
          {pingPongService.playerName == "player1" ? (
            <Button data={buttons.start} action={() => start()} />
          ) : (
            <Button
              data={{ ...buttons.start, text: "Waiting" }}
              action={() => {}}
            />
          )}
        </>
      )}
      {/* {status === "paused" && (
        <>
          <Button data={buttons.resume} action={cResumeGame} />
          <Ball data={ball} />
        </>
      )} */}
      {status === "playing" && <Ball data={ball} />}
      {status === "game-over" && (
        <>
          <Text
            text={
              winner
                ? winner.position === "left"
                  ? "Player 1 Wins"
                  : "Player 2 Wins"
                : ""
            }
            anchor={0.5}
            x={config.width / 2}
            y={50}
            isSprite
            style={
              new PIXI.TextStyle({
                align: "center",
                fontFamily: "Futura, sans-serif",
                fontSize: 40,
                fill: "#ffffff",
                letterSpacing: 10,
              })
            }
          />
          {/* <Button data={buttons.restart} action={() => cRestartGame()} /> */}
        </>
      )}
    </Container>
  );
}
