export type Player = {
  name: string;
  x: number;
  y: number;
};

export type Room = {
  createdAt: Date;
  code: string;
  players: Player[];
  owner: Player;
};

export type WebSocketMessageType = "create_room" | "join_room" | "leave_room";

export type WebSocketMessage = {
  type: WebSocketMessageType;
  data: {
    player?: Player;
    code?: string;
  };
};
