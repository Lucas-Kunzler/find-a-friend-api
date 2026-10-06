import request from "supertest";
import { app } from "@/app.js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateOrg } from "@/utils/test/create-and-authenticate-org.js";
import { createPets } from "@/utils/test/create-pets.js";

describe("List Pets (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
    const { token } = await createAndAuthenticateOrg(app);

    await createPets(app, token);
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to list pets", async () => {
    const response = await request(app.server).get("/pets").query({
      city: "Novo Hamburgo",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body.pets).toHaveLength(2);
  });

  it("should be able to list pets filtered by type", async () => {
    const response = await request(app.server).get("/pets").query({
      city: "Novo Hamburgo",
      type: "CAT",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body.pets).toHaveLength(1);
    expect(response.body.pets[0]).toEqual(
      expect.objectContaining({
        name: "Mike",
        type: "CAT",
      }),
    );
  });
});
