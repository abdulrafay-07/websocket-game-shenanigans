"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Home() {
  const [hasEnteredName, setHasEnteredName] = useState(false);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
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
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl font-bold text-fuchsia-700 mb-6">
        ryu multiplayer
      </h1>

      <div className="flex flex-col lg:flex-row items-center gap-4">

        {hasEnteredName ? (
          <>
            <Link href={`room?name=${name}`}>
              <button className="h-10 px-4 py-1.5 rounded-xl bg-fuchsia-900 text-white cursor-pointer">
                Create Room
              </button>
            </Link>

            <span className="font-semibold">or</span>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={code}
                min={6}
                max={6}
                onChange={(e) => setCode(e.target.value.length <= 6 ? e.target.value : code)}
                placeholder="Room Code"
                className="h-10 pl-3 px-4 rounded-xl max-w-36 border-2 border-gray-200"
              />
              <button
                onClick={handleNavigate}
                disabled={code.length !== 6}
                className="h-10 px-4 py-1.5 rounded-xl bg-fuchsia-900 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Join Room
              </button>
            </div>
          </>
        ) : (
          <div className="flex gap-2 items-end">
            <div className="flex flex-col gap-1">
              <label htmlFor="name">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tyler Durden"
                min={3}
                max={15}
                className="h-10 pl-3 px-4 rounded-xl border-2 border-gray-200"
              />
            </div>
            <button
              disabled={name.length < 3 || name.length > 15}
              onClick={() => setHasEnteredName(true)}
              className="h-10 px-4 py-1.5 rounded-xl bg-fuchsia-900 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Set Name
            </button>
          </div>
        )}
      </div>
    </div>
  )
};
