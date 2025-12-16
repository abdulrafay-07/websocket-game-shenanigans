import { generateCode } from "./utils";
import type { Player, Room } from "./types";

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

export function joinRoom(code: string, player: Player) {
  const room = getRoomFromCode(code);
  if (!room) return;

  room.players.push(player);
  return room;
};

export function leaveRoom(code: string, player: Player) {
  const room = getRoomFromCode(code);
  if (!room) return;

  if (room.players.length === 1) {
    destroyRoom(code);
    return room;
  };

  const index = room.players.findIndex(p => p.name === player.name);
  if (index === -1) return;

  room.players.splice(index, 1);
  return room;
};

function destroyRoom(code: string) {
  const deleted = rooms.delete(code);
  return deleted;
};

export function getPlayerFromRoomCode(code: string, playerToFind: Player) {
  const room = getRoomFromCode(code);

  return room?.players.find(p => p.name === playerToFind.name);
};

export function updatePlayerPosition(code: string, playerToUpdate: Player) {
  const player = getPlayerFromRoomCode(code, playerToUpdate);
  if (!player) return;

  player.x = playerToUpdate.x;
  player.y = playerToUpdate.y;

  return player;
};
