// src/http/controllers/routes/root.ts
import type { FastifyInstance } from "fastify";

export async function rootRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    return {
      name: "Find a Friend API",
      status: "online",
      docs: "https://github.com/Lucas-Kunzler/find-a-friend-api#readme",
      endpoints: {
        listPets: "/pets?city=Ivoti",
        petById: "/pets/:id",
        orgs: "/orgs",
      },
    };
  });

  app.get("/health", async () => ({ status: "ok" }));
}
