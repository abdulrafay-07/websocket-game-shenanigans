import { Elysia } from "elysia";

import type { PayloadMessage, WebSocketMessage } from "./ws/types";
import { createRoom, joinRoom, leaveRoom, updatePlayerPosition } from "./ws/room";
import { broadcastMessage } from "./ws/utils";

export const app = new Elysia()
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

        const payload: PayloadMessage = {
          type: "user_joined",
          data: {
            players: room.players,
          },
        };
        // Notify the users in the room
        broadcastMessage(ws, room.code, payload, true);
      };

      if (message.type === "leave_room") {
        if (!message.data.player || !message.data.code) return;

        const room = leaveRoom(message.data.code, message.data.player);
        if (!room) return;

        // Unsubscribe from room events
        ws.unsubscribe(room.code);

        const payload: PayloadMessage = {
          type: "user_left",
          data: {
            players: room.players,
          },
        };
        // Notify the other users in the room
        broadcastMessage(ws, room.code, payload);
      };

      if (message.type === "move_player") {
        if (!message.data.player || !message.data.code) return;

        const player = updatePlayerPosition(message.data.code, message.data.player);
        if (!player) return;

        // Broadcast position to users
        const payload: PayloadMessage = {
          type: "user_moved",
          data: {
            player: player,
          },
        };
        broadcastMessage(ws, message.data.code, payload, true);
      };
    },
    close(ws, code) {
      console.log(`Player disconnected, code: ${code}`);
    },
  })
  .listen(3001);

console.log("Server is listening on port 3001");
