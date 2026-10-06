import request from "supertest";
import type { FastifyInstance } from "fastify";
import type { Pet } from "@/generated/prisma/client.js";

export async function createPets(
  app: FastifyInstance,
  token: string,
): Promise<Pet[]> {
  const rexResponse = await request(app.server)
    .post("/pets")
    .set("Authorization", `Bearer ${token}`)
    .field("name", "Rex")
    .field("about", "Um cachorro muito amigável")
    .field("type", "DOG")
    .field("age", "ADULT")
    .field("energy", "5")
    .field("size", "LARGE")
    .field("independence", "HIGH")
    .field("environment", "LARGE")
    .field("requirements", "Ter espaço amplo")
    .attach("images", Buffer.from("fake image"), "rex.jpg");

  const mikeResponse = await request(app.server)
    .post("/pets")
    .set("Authorization", `Bearer ${token}`)
    .field("name", "Mike")
    .field("about", "Um gato muito amigável")
    .field("type", "CAT")
    .field("age", "PUPPY")
    .field("energy", "3")
    .field("size", "SMALL")
    .field("independence", "LOW")
    .field("environment", "MEDIUM")
    .field("requirements", "Requer atenção constante")
    .attach("images", Buffer.from("fake image"), "mike.jpg");

  return [rexResponse.body.pet, mikeResponse.body.pet];
}
