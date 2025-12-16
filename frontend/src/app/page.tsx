"use client";

import { useRef } from "react";

export default function Home() {
  const socketRef = useRef<WebSocket | null>(null);

  function connect() {
    if (socketRef.current) return; // prevent double connect

    const socket = new WebSocket("ws://localhost:3001/ws");
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("Connected to WebSocket");
    };

    socket.onmessage = (event) => {
      console.log("Message from server:", event.data);
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
      socketRef.current = null;
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }

  function disconnect() {
    socketRef.current?.close();
  }

  function createRoom() {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket is not connected");
      return;
    }

    const message = {
      type: "create_room",
      data: { player: { name: "ryu1", x: 0, y: 0 } }
    };

    socketRef.current.send(JSON.stringify(message));
    console.log("Sent create room message:", message);
  }

  function joinRoom() {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket is not connected");
      return;
    }

    const message = {
      type: "join_room",
      data: { code: "A9F5QZ", player: { name: "ryu2", x: 0, y: 0 } }
    };

    socketRef.current.send(JSON.stringify(message));
    console.log("Sent join room message:", message);
  }

  return (
    <div className="p-4 space-y-4">
      <button
        onClick={connect}
        className="px-4 py-2 bg-black text-white rounded"
      >
        Connect
      </button>

      <button
        onClick={disconnect}
        className="px-4 py-2 bg-gray-200 rounded"
      >
        Disconnect
      </button>

      <button
        onClick={createRoom}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Create Room
      </button>

      <button
        onClick={joinRoom}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Join Room
      </button>
    </div>
  );
}
