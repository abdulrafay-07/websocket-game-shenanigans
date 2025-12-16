import { Elysia } from "elysia";

import { broadcastMessage } from "./ws/utils";
import type { PayloadMessage, WebSocketMessage } from "./ws/types";
import { createRoom, joinRoom, leaveRoom, updatePlayerPosition } from "./ws/room";

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

        const payload: PayloadMessage = {
          type: "room_update",
          data: {
            room: room,
          },
        };
        ws.send(payload);
      };

      if (message.type === "join_room") {
        if (!message.data.player || !message.data.code) return;

        const { room, type } = joinRoom(message.data.code, message.data.player);
        if (!room) {
          ws.send(type);
          return;
        };

        // Subscribe to room events
        ws.subscribe(room.code);

        const payload: PayloadMessage = {
          type: "room_update",
          data: {
            room: room,
          },
        };
        // Notify the users in the room
        broadcastMessage(ws, room.code, payload, true);
      };

      if (message.type === "leave_room") {
        if (!message.data.player || !message.data.code) return;

        const { room, type } = leaveRoom(message.data.code, message.data.player);
        if (!room) {
          ws.send(type);
          return;
        };

        const payload: PayloadMessage = {
          type: "room_update",
          data: {
            room: room,
          },
        };
        // Notify the other users in the room
        broadcastMessage(ws, room.code, payload);

        // Unsubscribe from room events
        ws.unsubscribe(room.code);
      };

      if (message.type === "move_player") {
        if (!message.data.player || !message.data.code) return;

        const { player, type } = updatePlayerPosition(message.data.code, message.data.player);
        if (!player) {
          ws.send(type);
          return;
        };

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
