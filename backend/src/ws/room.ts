import { generateCode } from "./utils";
import type { PayloadMessageType, Player, Room } from "./types";

export const rooms: Map<string, Room> = new Map();

function getRoomFromCode(code: string) {
  return rooms.get(code);
};

export function createRoom(player: Player) {
  const roomCode = generateCode();

  rooms.set(roomCode, {
    createdAt: new Date(),
    code: roomCode,
    owner: player,
    players: [player],
  });

  return rooms.get(roomCode)!;
};

export function joinRoom(code: string, player: Player): { room?: Room, type?: PayloadMessageType } {
  const room = getRoomFromCode(code);
  if (!room) {
    return {
      type: "room_not_found"
    };
  };

  room.players.push(player);
  return {
    room
  };
};

export function leaveRoom(code: string, player: Player): { room?: Room, type?: PayloadMessageType } {
  const room = getRoomFromCode(code);
  if (!room) {
    return {
      type: "room_not_found",
    };
  };

  if (room.players.length === 1) {
    destroyRoom(code);
    return {
      room
    };
  };

  const index = room.players.findIndex(p => p.name === player.name);
  if (index === -1) {
    return {
      type: "player_not_found",
    };
  };

  room.players.splice(index, 1);
  return {
    room
  };
};

function destroyRoom(code: string) {
  const deleted = rooms.delete(code);
  return deleted;
};

export function updatePlayerPosition(code: string, playerToUpdate: Player): { room?: Room, type?: PayloadMessageType } {
  const room = getRoomFromCode(code);
  if (!room) {
    return {
      type: "room_not_found",
    };
  };

  const player = room.players.find(p => p.name === playerToUpdate.name);
  if (!player) {
    return {
      type: "player_not_found",
    };
  };

  player.x = playerToUpdate.x;
  player.y = playerToUpdate.y;
  player.facingDirection = playerToUpdate.facingDirection;

  return {
    room
  };
};
