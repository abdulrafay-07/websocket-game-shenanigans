import { Player, Room, WebSocketMessage } from "@/types";
import { KeyboardEventHandler, useEffect, useRef } from "react";

interface CanvasProps {
  room: Room | null;
  currentPlayer: Player | null;
  socket: WebSocket | null;
  code: string;
};

export const Canvas = ({
  room,
  currentPlayer,
  socket,
  code,
}: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  function drawPlayers(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    room?.players.map((player) => {
      ctx.fillStyle = "red"
      ctx.fillRect(player.x, player.y, 30, 30);

      ctx.font = "12px Helvetica";
      ctx.fillStyle = "black";
      ctx.fillText(player.name, player.x, player.y - 10);
    });
  };

  function sendMoveToSocket(currentPlayer: Player) {
    if (!socket) return;

    const message: WebSocketMessage = {
      type: "move_player",
      data: {
        player: currentPlayer,
        code,
      },
    };

    socket.send(JSON.stringify(message));
  };

  function handleKeyDown(e: React.KeyboardEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (e.key === "ArrowRight" && currentPlayer) {
      if (currentPlayer.x >= canvas.width - 30) return;

      currentPlayer.x += 1;
      sendMoveToSocket(currentPlayer);
    };

    if (e.key === "ArrowLeft" && currentPlayer) {
      if (currentPlayer.x <= 0) return;

      currentPlayer.x -= 1;
      sendMoveToSocket(currentPlayer);
    };

    if (e.key === "ArrowUp" && currentPlayer) {
      if (currentPlayer.y <= 20) return;

      currentPlayer.y -= 1;
      sendMoveToSocket(currentPlayer);
    };

    if (e.key === "ArrowDown" && currentPlayer) {
      if (currentPlayer.y >= canvas.height - 30) return;

      currentPlayer.y += 1;
      sendMoveToSocket(currentPlayer);
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  useEffect(() => {
    if (!socket) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    drawPlayers(canvas, ctx);
  }, [room]);

  return (
    <canvas
      tabIndex={0}
      ref={canvasRef}
      onKeyDown={handleKeyDown}
    ></canvas>
  )
};
