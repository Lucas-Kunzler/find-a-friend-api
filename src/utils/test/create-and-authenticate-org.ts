import request from "supertest";
import type { FastifyInstance } from "fastify";
import { prisma } from "@/lib/prisma.js";
import { hash } from "bcryptjs";
import type { Org } from "@/generated/prisma/client.js";

export async function createAndAuthenticateOrg(
  app: FastifyInstance,
): Promise<{ org: Org; token: string }> {
  const org = await prisma.org.create({
    data: {
      name: "Home Pet NH",
      email: "homepet@example.com",
      cep: "93310-270",
      address: "Rua Castro Alves, 205",
      city: "Novo Hamburgo",
      state: "RS",
      whatsapp: "(51) 9090-9090",
      password_hash: await hash("123456", 6),
    },
  });

  const authResponse = await request(app.server).post("/sessions").send({
    email: "homepet@example.com",
    password: "123456",
  });

  const { token } = authResponse.body;

  return { token, org };
}
