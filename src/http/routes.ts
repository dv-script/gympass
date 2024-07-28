import { FastifyInstance } from "fastify";
import { register } from "@/http/controllers/register.controller";
import { authenticate } from "./controllers/authenticate.controller";

export default async function routes(app: FastifyInstance) {
  app.post("/users", register);
  app.post("/auth", authenticate);
}
