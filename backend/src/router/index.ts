import { FastifyInstance } from "fastify";
import cards from "./cards";
import heaps from "./heaps";

export default async function router(fastify: FastifyInstance) {
  fastify.get("/health", (_, repl) => {
    repl.status(200);
    repl.send({ message: "ok" });
  });
  fastify.register(cards, { prefix: "/cards" });
  fastify.register(heaps, { prefix: "/heaps" });
}
