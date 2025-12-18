export type Player = {
  name: string;
  x: number;
  y: number;
  character: Character;
};

export type Character = {
  name: string;
  image: string;
  xStride: number;
  yStride: number;
  facingDirections: number[];
  currentDirection: number;
  currentFrame: number;
  isMoving: boolean;
};

export type Room = {
  createdAt: Date;
  code: string;
  players: Player[];
  owner: Player;
};

export type WebSocketMessageType = "create_room" | "join_room" | "leave_room" | "move_player";

export type WebSocketMessage = {
  type: WebSocketMessageType;
  data: {
    player?: Player;
    code?: string;
  };
};

export type PayloadMessageType = "players_update" | "room_update" | "user_moved" | "player_not_found" | "room_not_found";

export type PayloadMessage = {
  type: PayloadMessageType;
  data: {
    player?: Player;
    players?: Player[];
    room?: Room;
  };
};
