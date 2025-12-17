import { useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { X, Menu, LogOut } from "lucide-react";

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
  const [menuOpen, setMenuOpen] = useState(true);

  if (!room) return null;

  if (menuOpen) {
    return (
      <Card className="absolute top-4 left-4 w-72 rounded-2xl shadow-lg bg-background/95 backdrop-blur border transition-all duration-200 hover:shadow-xl py-4 gap-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4">
          <CardTitle className="text-base font-semibold">
            Room
          </CardTitle>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMenuOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4 px-4">
          {/* Room Code */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              Room Code
            </p>
            <p className="font-mono text-lg font-semibold tracking-wider">
              {room.code}
            </p>
          </div>

          <Separator />

          {/* Players */}
          <div className="space-y-2">
            <p className="text-sm font-medium">
              Players ({room.players.length})
            </p>

            <div className="flex flex-col gap-1">
              {room.players.map((player) => {
                const isOwner = room.owner.name === player.name;
                const isYou = player.name === currentPlayer?.name;

                return (
                  <div
                    key={player.name}
                    className="flex items-center justify-between text-sm px-2 py-1 rounded-md hover:bg-muted"
                  >
                    <span>{player.name}</span>

                    <div className="flex gap-1">
                      {isOwner && (
                        <Badge variant="secondary">Owner</Badge>
                      )}
                      {isYou && (
                        <Badge>You</Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Leave */}
          <Button
            variant="destructive"
            className="w-full"
            onClick={onRoomLeave}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Leave Room
          </Button>
        </CardContent>
      </Card>
    )
  };

  return (
    <Card className="absolute top-4 left-4 rounded-xl shadow-md p-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setMenuOpen(true)}
      >
        <Menu className="size-5" />
      </Button>
    </Card>
  );
};
