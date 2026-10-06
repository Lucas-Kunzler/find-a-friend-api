import type { FastifyInstance } from "fastify";
import { register } from "./register.js";
import { authenticate } from "./authenticate.js";
import { refresh } from "./refresh.js";
import { update } from "./update.js";
import { verifyJWT } from "@/http/middlewares/verify-jwt.js";
import { list } from "./list.js";
import { get } from "./get.js";

export async function orgsRoutes(app: FastifyInstance) {
  app.post("/orgs", register);
  app.get("/orgs", list);
  app.get("/orgs/:orgId", get);
  app.patch("/orgs", { onRequest: [verifyJWT] }, update);

  app.post("/sessions", authenticate);
  app.patch("/token/refresh", refresh);
}
