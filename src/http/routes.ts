import { FastifyInstance } from "fastify";
import { register } from "@/http/controllers/register.controller";

export default async function routes(app: FastifyInstance) {
  app.post("/users", register);
}
