import { Player, Room } from "@/types";

interface RoomStateProps {
  room: Room | null;
  currentPlayer: Player | null;
  onRoomLeave: () => void;
};

export const RoomState = ({
  room,
  currentPlayer,
  onRoomLeave,
}: RoomStateProps) => {
  return room && (
    <div className="absolute top-4 left-4 border rounded-xl hover:shadow-md p-4 border-gray-200 duration-300 transition-all hover:scale-102">
      <h3 className="text-xl mb-4 font-semibold">
        Room Code: {room.code}
      </h3>

      <h4 className="text-lg font-semibold">
        Players joined:
      </h4>
      <div className="flex flex-col gap-0.5 pl-1 mb-6">
        {room.players.map((player) => (
          <p
            key={player.name}
          >
            {player.name} {room.owner.name === player.name ? "(owner)" : player.name === currentPlayer?.name && "(you)"}
          </p>
        ))}
      </div>

      <button
        onClick={onRoomLeave}
        className="h-10 px-4 py-1.5 rounded-xl bg-fuchsia-50 duration-100 transition-all hover:bg-fuchsia-100 text-fuchsia-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
      >
        Leave Room
      </button>
    </div>
  )
};
