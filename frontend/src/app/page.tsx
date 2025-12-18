"use client"

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { characters } from "@/constants";
import { cn } from "@/lib/utils";

export default function Home() {
  const [inputState, setInputState] = useState<"name" | "character" | "code">("name");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [character, setCharacter] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const nameFromParams = searchParams.get("name");

  useEffect(() => {
    if (nameFromParams && nameFromParams.length > 3 && nameFromParams.length <= 15) {
      setName(nameFromParams);
      setInputState("character");
    };
  }, [nameFromParams]);

  const handleNavigate = () => {
    router.push(`/room/?name=${name}&character=${character}&room_code=${code}`);
  };

  return (
    <div className="h-full flex items-center justify-center bg-linear-to-br from-fuchsia-50 to-white px-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">
            Ryu Multiplayer
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Create or join a room to start playing
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {inputState === "name" && (
            <>
              {/* Name Step */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  Name (3–15 characters)
                </p>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>

              <Button
                className="w-full"
                disabled={name.length < 3 || name.length > 15}
                onClick={() => setInputState("character")}
              >
                Continue
              </Button>
            </>
          )}
          {inputState === "character" && (
            <>
              <div className="text-center space-y-1">
                <p className="text-sm font-medium">Choose your character</p>
                <p className="text-xs text-muted-foreground">This cannot be changed in-game</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {characters.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setCharacter(c.name)}
                    className={cn(
                      "relative rounded-xl border p-3 transition-all",
                      "hover:border-primary hover:shadow-sm",
                      character === c.name
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-border"
                    )}
                  >
                    <div className="aspect-square relative mb-2">
                      <Image
                        src={c.image}
                        alt={c.name}
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                    <p className="text-sm font-medium text-center">{c.name}</p>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button
                  variant="ghost"
                  onClick={() => setInputState("name")}
                >
                  Back
                </Button>
                <Button
                  disabled={!character}
                  onClick={() => setInputState("code")}
                >
                  Continue
                </Button>
              </div>
            </>
          )}
          {inputState === "code" && (
            <>
              {/* Create Room */}
              <Link href={`/room?name=${name}&character=${character}`}>
                <Button className="w-full">
                  Create Room
                </Button>
              </Link>

              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">OR</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Join Room */}
              <div className="space-y-2">
                <Input
                  type="text"
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value.toUpperCase().slice(0, 6))
                  }
                  placeholder="Enter 6-digit room code"
                />

                <Button
                  className="w-full"
                  disabled={code.length !== 6}
                  onClick={handleNavigate}
                >
                  Join Room
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
};
