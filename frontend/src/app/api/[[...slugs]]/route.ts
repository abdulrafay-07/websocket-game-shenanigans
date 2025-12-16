import { Elysia, t } from "elysia";

const app = new Elysia()
  .ws("/ws", {
    open(ws) {
      const code = ws.id;
      console.log(code);
    },
  })
  .listen(3000);

export const GET = app.fetch;
export const POST = app.fetch;
