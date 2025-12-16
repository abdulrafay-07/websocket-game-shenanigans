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

export type WebSocketMessageType = "create_room" | "join_room" | "leave_room" | "move_player";

export type WebSocketMessage = {
  type: WebSocketMessageType;
  data: {
    player?: Player;
    code?: string;
  };
};

export type PayloadMessageType = "players_update" | "room_update" | "user_moved";

export type PayloadMessage = {
  type: PayloadMessageType;
  data: {
    player?: Player;
    players?: Player[];
    room?: Room;
  };
};
