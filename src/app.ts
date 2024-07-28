import fastify from "fastify";
import routes from "@/http/routes";
import { env } from "./env";

export const app = fastify();

app.register(routes);

app.setErrorHandler((error, _, reply) => {
  if (env.NODE_ENV !== "production") {
    console.error(error);
  } else {
    // TODO: Send error to monitoring service
  }

  reply.status(500).send({ message: "Internal server error" });
});
