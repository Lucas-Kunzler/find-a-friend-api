import request from "supertest";
import { app } from "@/app.js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateOrg } from "@/utils/test/create-and-authenticate-org.js";
import { createPets } from "@/utils/test/create-pets.js";

describe("List Pets (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to find a pet by its id", async () => {
    const { token } = await createAndAuthenticateOrg(app);
    const pets = await createPets(app, token);
    const response = await request(app.server).get(`/pets/${pets[0]!.id}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.pet.id).toEqual(pets[0]!.id);
  });

  it("should not be able to find a pet with wrong id", async () => {
    const response = await request(app.server).get(
      "/pets/00000000-0000-0000-0000-000000000000",
    );

    expect(response.statusCode).toEqual(404);
  });
});
