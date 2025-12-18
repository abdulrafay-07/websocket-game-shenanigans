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
  const tileImageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  function drawPlayers(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    if (!isLoaded) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;

    // Draw tiles
    const totalCols = canvas.width / 32;
    const totalRows = canvas.height / 32;

    console.log("outside")
    if (tileImageRef.current) {
      console.log("inside")
      for (let i = 0; i < totalCols; i++) {
        for (let j = 0; j < totalRows; j++) {
          ctx.drawImage(
            tileImageRef.current,
            i * 32,
            j * 32,
            TILE_SIZE,
            TILE_SIZE,
          );
        };
      };
    };

    room?.players.forEach((player) => {
      const img = imagesRef.current[player.character.image];
      if (!img) return;

      ctx.drawImage(
        img,
        player.character.currentFrame * player.character.xStride,
        player.character.currentDirection * player.character.yStride,
        player.character.xStride,
        player.character.yStride,
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

    currentPlayer.character.isMoving = true;

    if (e.key === "ArrowRight" && currentPlayer) {
      if (currentPlayer.x >= canvas.width - (TILE_SIZE * 3)) return;

      currentPlayer.x += 32;
      currentPlayer.character.currentDirection = currentPlayer.character.facingDirections[0];
      sendMoveToSocket(currentPlayer);
    };

    if (e.key === "ArrowLeft" && currentPlayer) {
      if (currentPlayer.x <= 0) return;

      currentPlayer.x -= 32;
      currentPlayer.character.currentDirection = currentPlayer.character.facingDirections[1];
      sendMoveToSocket(currentPlayer);
    };

    if (e.key === "ArrowUp" && currentPlayer) {
      if (currentPlayer.y <= 0) return;

      currentPlayer.y -= 32;
      currentPlayer.character.currentDirection = currentPlayer.character.facingDirections[2];
      sendMoveToSocket(currentPlayer);
    };

    if (e.key === "ArrowDown" && currentPlayer) {
      if (currentPlayer.y >= canvas.height - (TILE_SIZE * 3)) return;

      currentPlayer.y += 32;
      currentPlayer.character.currentDirection = currentPlayer.character.facingDirections[3];
      sendMoveToSocket(currentPlayer);
    };
  };

  function handleKeyUp() {
    if (!currentPlayer) return;

    currentPlayer.character.isMoving = false;
  };

  async function loadAssets(characters: boolean, tile: boolean) {
    setIsLoaded(false);

    if (characters && room) {
      const loadPromises = room.players.map((player) => {
        if (imagesRef.current[player.character.image]) return Promise.resolve();

        return new Promise<void>((resolve) => {
          const img = new Image();
          img.src = player.character.image;
          img.onload = () => {
            imagesRef.current[player.character.image] = img;
            resolve();
          };
        });
      });

      await Promise.all(loadPromises);
    };

    if (tile) {
      const tileImg = new Image();
      tileImg.src = "/tile.png";
      tileImg.onload = () => tileImageRef.current = tileImg;
    };

    setIsLoaded(true);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth - 128 - (window.innerWidth % 32);
    canvas.height = window.innerHeight - 128 - (window.innerHeight % 32);

    loadAssets(false, true);
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
    loadAssets(true, false);
  }, [isLoaded, room?.players.length]);

  return (
    <canvas
      tabIndex={0}
      ref={canvasRef}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      className="flex items-center justify-center border"
    ></canvas>
  )
};
