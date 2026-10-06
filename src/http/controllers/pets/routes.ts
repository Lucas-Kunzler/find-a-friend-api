import type { FastifyInstance } from "fastify";
import { register } from "./register.js";
import { list } from "./list.js";
import { verifyJWTBeforeParsing } from "@/http/middlewares/verify-jwt.js";
import { findById } from "./find-pet-by-id.js";

export async function petsRoutes(app: FastifyInstance) {
  app.post("/pets", { preParsing: [verifyJWTBeforeParsing] }, register);
  app.get("/pets", list);
  app.get("/pets/:id", findById);
}
