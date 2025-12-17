"use client"

import Link from "next/link";
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

export default function Home() {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [hasEnteredName, setHasEnteredName] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const nameFromParams = searchParams.get("name");

  useEffect(() => {
    if (nameFromParams && nameFromParams.length > 3 && nameFromParams.length <= 15) {
      setName(nameFromParams);
      setHasEnteredName(true);
    };
  }, [nameFromParams]);

  const handleNavigate = () => {
    router.push(`/room/?name=${name}&room_code=${code}`);
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
          {hasEnteredName ? (
            <>
              {/* Create Room */}
              <Link href={`/room?name=${name}`}>
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
          ) : (
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
                onClick={() => setHasEnteredName(true)}
              >
                Continue
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
};
