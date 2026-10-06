import request from "supertest";
import { app } from "@/app.js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("List Orgs (e2e)", () => {
  beforeAll(async () => {
    await app.ready();

    await request(app.server).post("/orgs").send({
      name: "Home Pet NH",
      email: "homepet@example.com",
      cep: "93310-270",
      address: "Rua Castro Alves, 205",
      city: "Novo hamburgo",
      state: "RS",
      whatsapp: "(51) 9090-9090",
      password: "123456",
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to list orgs", async () => {
    const response = await request(app.server).get("/orgs").query({
      page: 1,
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body.orgs).toHaveLength(1);
    expect(response.body.orgs[0]).toEqual(
      expect.objectContaining({
        name: "Home Pet NH",
        email: "homepet@example.com",
      }),
    );
  });
});
