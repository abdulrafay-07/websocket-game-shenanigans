import type { ElysiaWS } from "elysia/ws";

import type { PayloadMessage } from "./types";

export function broadcastMessage(
  ws: ElysiaWS,
  code: string,
  payload: PayloadMessage,
  includeSelf = false,
) {
  ws.publish(code, payload);
  if (includeSelf) ws.send(payload);
};

export function generateCode(length = 6) {
  const possibleValues = `0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ`;
  let code = "";

  for (let i = 0; i < length; i++) {
    code += possibleValues.charAt(Math.floor(Math.random() * possibleValues.length));
  };

  return code;
};
