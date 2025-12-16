"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { RoomState } from "@/components/room/room-state";

import { Player, WebSocketMessage, Room, PayloadMessage } from "@/types";

export default function RoomPage() {
  const [room, setRoom] = useState<Room | null>(null);
  const [gameState, setGameState] = useState<"joining" | "creating" | "joined" | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const playerRef = useRef<Player | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const name = searchParams.get("name");
  const roomCode = searchParams.get("room_code");

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

    router.replace("/");
  };

  useEffect(() => {
    connect();

    // Initialize Player
    const player: Player = {
      name: name ?? "Anonymous",
      x: 0,
      y: 0,
    };
    playerRef.current = player;
  }, []);

  return (
    <div className="flex items-center justify-center h-full relative">
      {gameState === "joining" && <p>Joining room...</p>}
      {gameState === "creating" && <p>Creating room...</p>}
      {gameState === "joined" && (
        <div>
          <RoomState room={room} currentPlayer={playerRef.current} onRoomLeave={leaveRoom} />
        </div>
      )}
    </div>
  )
};
