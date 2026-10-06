import request from "supertest";
import { app } from "@/app.js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Register Org (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to register", async () => {
    const response = await request(app.server).post("/orgs").send({
      name: "Home Pet NH",
      email: "homepet@example.com",
      cep: "93310-270",
      address: "Rua Castro Alves, 205",
      city: "Novo hamburgo",
      state: "RS",
      whatsapp: "(51) 9090-9090",
      password: "123456",
    });

    await expect(response.statusCode).toEqual(201);
  });
});
