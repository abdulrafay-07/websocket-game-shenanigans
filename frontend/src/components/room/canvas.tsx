import { useEffect, useRef, useState } from "react";

import { Player, Room, WebSocketMessage } from "@/types";

interface CanvasProps {
  room: Room | null;
  currentPlayer: Player | null;
  socket: WebSocket | null;
  code: string;
};

const TILE_SIZE = 32;

export const Canvas = ({
  room,
  currentPlayer,
  socket,
  code,
}: CanvasProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const imagesRef = useRef<Record<string, HTMLImageElement>>({});
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  function drawPlayers(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    if (!isLoaded) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;

    room?.players.forEach((player, index) => {
      const img = imagesRef.current[player.character];
      if (!img) return;

      ctx.drawImage(
        img,
        player.currentFrame * player.strideSize,
        player.facingDirection * player.strideSize,
        player.strideSize,
        player.strideSize,
        player.x,
        player.y,
        TILE_SIZE * 3,
        TILE_SIZE * 3,
      );

      ctx.font = "12px Helvetica";
      ctx.fillStyle = "black";
      ctx.fillText(player.name, player.x + 32, player.y - 10);
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
    if (!currentPlayer) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    currentPlayer.isMoving = true;

    if (e.key === "ArrowRight" && currentPlayer) {
      if (currentPlayer.x >= canvas.width - (TILE_SIZE * 3)) return;

      currentPlayer.x += 32;
      currentPlayer.facingDirection = 2;
      sendMoveToSocket(currentPlayer);
    };

    if (e.key === "ArrowLeft" && currentPlayer) {
      if (currentPlayer.x <= 0) return;

      currentPlayer.x -= 32;
      currentPlayer.facingDirection = 3;
      sendMoveToSocket(currentPlayer);
    };

    if (e.key === "ArrowUp" && currentPlayer) {
      if (currentPlayer.y <= 0) return;

      currentPlayer.y -= 32;
      currentPlayer.facingDirection = 1;
      sendMoveToSocket(currentPlayer);
    };

    if (e.key === "ArrowDown" && currentPlayer) {
      if (currentPlayer.y >= canvas.height - (TILE_SIZE * 3)) return;

      currentPlayer.y += 32;
      currentPlayer.facingDirection = 0;
      sendMoveToSocket(currentPlayer);
    };
  };

  function handleKeyUp() {
    if (!currentPlayer) return;

    currentPlayer.isMoving = false;
  };

  async function loadImages() {
    if (!room) return;
    setIsLoaded(false);

    const loadPromises = room.players.map((player) => {
      if (imagesRef.current[player.character]) return Promise.resolve();

      return new Promise<void>((resolve) => {
        const img = new Image();
        img.src = player.character;
        img.onload = () => {
          imagesRef.current[player.character] = img;
          resolve();
        };
      });
    });

    await Promise.all(loadPromises);
    setIsLoaded(true);
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

    if (isLoaded) drawPlayers(canvas, ctx);
  }, [isLoaded, room]);

  useEffect(() => {
    loadImages();
  }, [isLoaded, room?.players.length]);

  return (
    <canvas
      tabIndex={0}
      ref={canvasRef}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
    ></canvas>
  )
};
