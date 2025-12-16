import { Elysia } from "elysia";

import type { WebSocketMessage } from "./ws/types";
import { createRoom, destroyRoom, joinRoom, leaveRoom } from "./ws/room";

const app = new Elysia()
  .ws("/ws", {
    open(ws) {
      console.log(`Player connected: ${ws.id}`);
    },
    message(ws, message: WebSocketMessage) {
      if (message.type === "create_room") {
        if (!message.data.player) return;

        const room = createRoom(message.data.player);

        // Subscribe to room events
        ws.subscribe(room.code);
      };

      if (message.type === "join_room") {
        if (!message.data.player || !message.data.code) return;

        const room = joinRoom(message.data.code, message.data.player);
        if (!room) return;

        // Subscribe to room events
        ws.subscribe(room.code);
      };

      if (message.type === "leave_room") {
        if (!message.data.player || !message.data.code) return;

        const room = leaveRoom(message.data.code, message.data.player);
        if (!room) return;

        // Unsubscribe from room events
        ws.unsubscribe(room.code);
      };
    },
    close(ws, code) {
      console.log(`Player disconnected, code: ${code}`);
    },
  })
  .listen(3001);

console.log("Server is listening on port 3001");
