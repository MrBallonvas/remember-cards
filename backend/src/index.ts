import Fastify from "fastify";
import router from "./router/index";

const fastify = Fastify({ logger: true });

fastify.register(router, { prefix: "/api/v1/" });

fastify.listen({ host: "0.0.0.0", port: 3000 }, (err, addr) => {
  if (err) {
    throw new Error(err.message);
  } else {
    console.log(`Server was started on ${addr}`);
  }
});
