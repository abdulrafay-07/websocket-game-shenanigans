import { generateCode } from "./utils";
import type { Player, Room } from "./types";

const rooms: Map<string, Room> = new Map();

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

export function joinRoom(code: string, player: Player) {
  const existingRoom = rooms.get(code);
  if (!existingRoom) return;

  existingRoom.players.push(player);
  return existingRoom;
};

export function leaveRoom(code: string, player: Player) {
  const existingRoom = rooms.get(code);
  if (!existingRoom) return;

  const index = existingRoom.players.findIndex(p => p.name === player.name);
  if (index === -1) return;

  if (existingRoom.players.length === 1) {
    destroyRoom(code);
    return existingRoom;
  };

  existingRoom.players.splice(index, 1);
  return existingRoom;
};

export function destroyRoom(code: string) {
  const deleted = rooms.delete(code);
  return deleted;
};
