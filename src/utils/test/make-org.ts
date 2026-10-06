import { hash } from "bcryptjs";
import type { InMemoryOrgsRepository } from "@/repositories/in-memory/in-memory-orgs-repository.js";

export async function makeOrg(
  orgsRepository: InMemoryOrgsRepository,
  overrides = {},
) {
  const org = await orgsRepository.create({
    name: "Home Pet NH",
    email: "homepet@example.com",
    cep: "93310-270",
    address: "Rua Castro Alves, 205",
    city: "Novo Hamburgo",
    state: "RS",
    whatsapp: "(51) 9090-9090",
    password_hash: await hash("123456", 6),
    ...overrides,
  });

  return org;
}
