import request from "supertest";
import { app } from "@/app.js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Refresh Token Org (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to refresh a token", async () => {
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

    const authResponse = await request(app.server).post("/sessions").send({
      email: "homepet@example.com",
      password: "123456",
    });

    const cookies = authResponse.get("Set-Cookie");

    if (!cookies) {
      throw new Error("Cookie não encontrado");
    }

    const response = await request(app.server)
      .patch("/token/refresh")
      .set("Cookie", cookies)
      .send();

    await expect(response.statusCode).toEqual(200);
    await expect(response.body).toEqual({
      token: expect.any(String),
    });
    await expect(response.get("Set-Cookie")).toEqual([
      expect.stringContaining("refreshToken="),
    ]);
  });
});
