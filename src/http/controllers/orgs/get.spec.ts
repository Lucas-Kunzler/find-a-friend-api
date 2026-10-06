import request from "supertest";
import { app } from "@/app.js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateOrg } from "@/utils/test/create-and-authenticate-org.js";

describe("Get Org (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to get an org by id", async () => {
    const { org, token } = await createAndAuthenticateOrg(app);

    const response = await request(app.server)
      .get(`/orgs/${org.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      org: expect.objectContaining({
        id: org.id,
        name: org.name,
        email: org.email,
        cep: org.cep,
        address: org.address,
        city: org.city,
        state: org.state,
        whatsapp: org.whatsapp,
      }),
    });
  });
});
