import {
  getAllHeaps,
  getHeap,
  delHeap,
  changeHeap,
  createHeap,
} from "../actions/heaps";
import { HeapData } from "../db/types";
import { FastifyInstance, FastifyRequest } from "fastify";

export default async function heaps(fastify: FastifyInstance) {
  // get all heaps
  fastify.get("/", async (req, repl) => {
    const response = await getAllHeaps();
    repl.status(200);
    repl.send(response);
  });

  // get heap by id
  fastify.get(
    "/:heap_id",
    async (req: FastifyRequest<{ Params: { heap_id: string } }>, repl) => {
      const { heap_id } = req.params;
      if (heap_id) {
        const response = await getHeap(heap_id);
        if (response?.heap_id) {
          repl.status(200);
          repl.send(response);
        } else {
          repl.status(404);
          repl.send({ message: `heap with heap_id = ${heap_id} not found` });
        }
      } else {
        repl.status(400);
        repl.send({ message: "heap_id is required" });
      }
    },
  );

  // delete heap by id
  fastify.delete(
    "/:heap_id",
    async (req: FastifyRequest<{ Params: { heap_id: string } }>, repl) => {
      const { heap_id } = req.params;
      if (heap_id) {
        await delHeap(heap_id);
        repl.status(200).send();
      } else {
        repl.status(400).send({ message: "heap_id is required" });
      }
    },
  );

  // create new heap
  fastify.post("/", async (req: FastifyRequest<{ Body: HeapData }>, repl) => {
    const body = req.body;
    if (body.heap_id) {
      const response = await createHeap(body);
      repl.status(200).send(response);
    } else {
      repl.status(400).send({ message: "heap_id is required" });
    }
  });

  // update heap by id
  fastify.put(
    "/:heap_id",
    async (
      req: FastifyRequest<{ Params: { heap_id: string }; Body: HeapData }>,
      repl,
    ) => {
      const { heap_id } = req.params;
      const body = req.body;

      if (heap_id && body) {
        const response = await changeHeap(heap_id, body);
        repl.status(200).send(response);
      } else {
        repl.status(400).send({ message: "Invalid heap_id or body" });
      }
    },
  );
}
