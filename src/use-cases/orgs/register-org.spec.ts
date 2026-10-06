import { RegisterOrgsUseCase } from "./register-org.js";
import { beforeEach, describe, expect, it } from "vitest";
import { compare } from "bcryptjs";
import { OrgAlreadyExistsError } from "../errors/org-already-exists-error.js";
import { InMemoryOrgsRepository } from "@/repositories/in-memory/in-memory-orgs-repository.js";

let orgsRepository: InMemoryOrgsRepository;
let sut: RegisterOrgsUseCase;

describe("Register Org Use Case", () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository();
    sut = new RegisterOrgsUseCase(orgsRepository);
  });

  it("should be able to register", async () => {
    const { org } = await sut.execute({
      name: "Home Pet NH",
      email: "homepet@example.com",
      cep: "93310-270",
      address: "Rua Castro Alves, 205",
      city: "Novo hamburgo",
      state: "RS",
      whatsapp: "(51) 9090-9090",
      password: "123456",
    });

    await expect(org.id).toEqual(expect.any(String));
  });

  it("should hash org password upon registration", async () => {
    const { org } = await sut.execute({
      name: "Home Pet NH",
      email: "homepet@example.com",
      cep: "93310-270",
      address: "Rua Castro Alves, 205",
      city: "Novo hamburgo",
      state: "RS",
      whatsapp: "(51) 9090-9090",
      password: "123456",
    });

    const isPasswordCorrectlyHashed = await compare(
      "123456",
      org.password_hash,
    );

    await expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should not be able to register with same email twice", async () => {
    const email = "johndoe@example.com";

    await sut.execute({
      name: "Home Pet NH",
      email,
      cep: "93310-270",
      address: "Rua Castro Alves, 205",
      city: "Novo hamburgo",
      state: "RS",
      whatsapp: "(51) 9090-9090",
      password: "123456",
    });

    await expect(() =>
      sut.execute({
        name: "Home Pet NH",
        email,
        cep: "93310-270",
        address: "Rua Castro Alves, 205",
        city: "Novo hamburgo",
        state: "RS",
        whatsapp: "(51) 9090-9090",
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(OrgAlreadyExistsError);
  });
});
