import {
  getAllCards,
  getCard,
  delCard,
  changeCard,
  createCard,
} from "../actions/cards";
import { CardData } from "../db/types";
import { FastifyInstance, FastifyRequest } from "fastify";

export default async function cards(fastify: FastifyInstance) {
  // get all cards in heap
  fastify.get("/", async (req, repl) => {
    const heap_id = new URLSearchParams(req.query as string).get("heap_id");
    if (heap_id) {
      const response = await getAllCards(heap_id);
      repl.status(200).send(response);
    } else {
      repl.status(400);
    }
  });

  // get card by id
  fastify.get(
    "/:card_id",
    async (req: FastifyRequest<{ Params: { card_id: string } }>, repl) => {
      const card_id = req.params.card_id;
      if (card_id) {
        const response = await getCard(card_id);
        if (response.card_id) {
          repl.status(200).send(response);
        } else {
          repl.status(400).send(`card with card_id = ${card_id} not found`);
        }
      } else {
        repl.status(409);
      }
    },
  );

  // get all cards in heap
  fastify.delete(
    "/:card_id",
    async (req: FastifyRequest<{ Params: { card_id: string } }>, repl) => {
      const card_id = req.params.card_id;
      if (card_id) {
        await delCard(card_id);
        repl.status(200);
      } else {
        repl.status(409);
      }
    },
  );

  // create new card
  fastify.post("/", async (req: FastifyRequest<{ Body: CardData }>, repl) => {
    const body = req.body;
    if (body.card_id) {
      const response = createCard(body);
      repl.status(200).send(response);
    } else {
      repl.status(400);
    }
  });

  // update card by id
  fastify.post(
    "/:card_id",
    async (
      req: FastifyRequest<{ Params: { card_id: string }; Body: CardData }>,
      repl,
    ) => {
      const { card_id } = req.params;
      const body = req.body;

      if (card_id && body) {
        const response = changeCard(card_id, body);
        repl.status(200).send(response);
      } else {
        repl.status(400).send({ message: "Invalid card_id or body" });
      }
    },
  );
}
