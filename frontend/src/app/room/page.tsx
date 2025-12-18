"use client"

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Canvas } from "@/components/room/canvas";
import { RoomState } from "@/components/room/room-state";

import { characters } from "@/constants";
import { getRandomPosition } from "@/lib/ws-utils";
import { Player, WebSocketMessage, Room, PayloadMessage, PayloadMessageType, GameStates } from "@/types";

export default function RoomPage() {
  const [room, setRoom] = useState<Room | null>(null);
  const [gameState, setGameState] = useState<GameStates | null>(null);
  const [errorType, setErrorType] = useState<PayloadMessageType | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const playerRef = useRef<Player | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const name = searchParams.get("name");
  const roomCode = searchParams.get("room_code");
  const characterName = searchParams.get("character");

  function connect() {
    if (socketRef.current) return;

    const socket = new WebSocket("ws://localhost:3001/ws");
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("Connected to WebSocket");

      if (roomCode) {
        // join the room
        setGameState("joining");
        joinRoom();
        setGameState("joined");
      } else {
        // create the room
        setGameState("creating");
        createRoom();
        setGameState("joined");
      };
    };

    socket.onmessage = (event) => {
      const message: PayloadMessage = JSON.parse(event.data);
      console.log("Message from server:", message);

      if (message.type === "room_update") {
        if (message.data.room) setRoom(message.data.room);
      };

      if (message.type === "room_not_found") {
        setGameState("error");
        setErrorType(message.type);
      };
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
      socketRef.current = null;
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  };

  function createRoom() {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket is not connected");
      return;
    };

    const player = playerRef.current;
    if (!player) {
      console.warn("Player not initialized");
      return;
    };

    const message: WebSocketMessage = {
      type: "create_room",
      data: {
        player,
      },
    };
    socket.send(JSON.stringify(message));
  };

  function joinRoom() {
    if (!roomCode) return;

    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket is not connected");
      return;
    };

    const player = playerRef.current;
    if (!player) {
      console.warn("Player not initialized");
      return;
    };

    const message: WebSocketMessage = {
      type: "join_room",
      data: {
        code: roomCode,
        player,
      },
    };
    socket.send(JSON.stringify(message));
  };

  function leaveRoom() {
    if (!roomCode) return;

    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket is not connected");
      return;
    };

    const player = playerRef.current;
    if (!player) {
      console.warn("Player not initialized");
      return;
    };

    const message: WebSocketMessage = {
      type: "leave_room",
      data: {
        code: roomCode,
        player,
      },
    };

    socket.send(JSON.stringify(message));
    socket.close();

    router.replace(`/?name=${name}`);
  };

  useEffect(() => {
    connect();

    // Initialize Player
    const player: Player = {
      name: name ?? "Anonymous",
      x: getRandomPosition(window.innerWidth - 128 - (window.innerWidth % 32)),
      y: getRandomPosition(window.innerHeight - 128 - (window.innerHeight % 32)),
      character: characters.find(c => c.name === characterName) ?? characters[0],
    };
    playerRef.current = player;
  }, []);

  return (
    <div className="flex items-center justify-center h-full relative">
      {gameState === "joining" && <p>Joining room...</p>}
      {gameState === "creating" && <p>Creating room...</p>}
      {gameState === "error" && (
        <div className="flex flex-col items-center">
          <h3 className="text-xl mb-4">
            {errorType === "room_not_found" && "The room you are looking for does not exist..."}
          </h3>
          <Link href={`/?name=${name}`}>
            <button className="h-10 px-4 py-1.5 rounded-xl bg-fuchsia-50 duration-100 transition-all hover:scale-105 text-fuchsia-800 hover:bg-fuchsia-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold">
              Go Back Home
            </button>
          </Link>
        </div>
      )}
      {gameState === "joined" && (
        <div>
          <div className="absolute top-2 right-10">
            {playerRef.current?.x}<br />
            {playerRef.current?.y}
          </div>
          <RoomState room={room} currentPlayer={playerRef.current} onRoomLeave={leaveRoom} />
          <Canvas room={room} currentPlayer={playerRef.current} socket={socketRef.current} code={room?.code!} />
        </div>
      )}
    </div>
  )
};
