import { Character } from "@/types";

export const characters: Character[] = [
  {
    name: "John",
    image: "/john.png",
    currentFrame: 0,
    xStride: 250,
    yStride: 250,
    isMoving: false,
    facingDirections: [2, 3, 1, 0],
    currentDirection: 3,
  },
  {
    name: "Nathan",
    image: "/nathan.png",
    currentFrame: 2,
    xStride: 213.5,
    yStride: 320,
    isMoving: false,
    facingDirections: [1, 2, 3, 0],
    currentDirection: 3,
  },
];
