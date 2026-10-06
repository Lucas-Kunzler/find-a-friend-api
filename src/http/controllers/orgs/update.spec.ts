import request from "supertest";
import { app } from "@/app.js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateOrg } from "@/utils/test/create-and-authenticate-org.js";

describe("Update Org (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to update an org", async () => {
    const { token } = await createAndAuthenticateOrg(app);

    const response = await request(app.server)
      .patch("/orgs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Home Pet Novo Hamburgo",
        city: "Novo Hamburgo",
        whatsapp: "(51) 99999-9999",
      });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      org: expect.objectContaining({
        id: expect.any(String),
        name: "Home Pet Novo Hamburgo",
        email: "homepet@example.com",
        city: "Novo Hamburgo",
        whatsapp: "(51) 99999-9999",
      }),
    });
  });

  it("should not be able to update an org without authentication", async () => {
    const response = await request(app.server).patch("/orgs").send({
      name: "Home Pet Novo Hamburgo",
    });

    expect(response.statusCode).toEqual(401);
    expect(response.body).toEqual({
      message: "Unauthorized",
    });
  });
});
