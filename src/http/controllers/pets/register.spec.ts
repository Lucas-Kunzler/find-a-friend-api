import request from "supertest";
import { app } from "@/app.js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateOrg } from "@/utils/test/create-and-authenticate-org.js";

describe("Register Pet (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to register a pet", async () => {
    const { token } = await createAndAuthenticateOrg(app);

    const response = await request(app.server)
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

    expect(response.statusCode).toEqual(201);
  });

  it("should not be able to register a pet without authentication", async () => {
    const response = await request(app.server)
      .post("/pets")
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

    expect(response.statusCode).toEqual(401);
  });
});
