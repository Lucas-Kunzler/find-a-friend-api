import type { OrgsRepository } from "@/repositories/orgs-repository.js";
import { AuthenticateUseCase } from "./authenticate.js";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryOrgsRepository } from "@/repositories/in-memory/in-memory-orgs-repository.js";
import { InvalidCredentialsError } from "../errors/invalid-credentials-error.js";
import { makeOrg } from "@/utils/test/make-org.js";

let orgsRepository: OrgsRepository;
let sut: AuthenticateUseCase;

describe("Authenticate Use Case", () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository();
    sut = new AuthenticateUseCase(orgsRepository);
  });

  it("should be able to authenticate", async () => {
    await makeOrg(orgsRepository);

    const { org } = await sut.execute({
      email: "homepet@example.com",
      password: "123456",
    });

    await expect(org.id).toEqual(expect.any(String));
  });

  it("should not be able to authenticate with wrong email", async () => {
    await expect(() =>
      sut.execute({
        email: "wrongemail@example.com",
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate with wrong password", async () => {
    await makeOrg(orgsRepository);

    await expect(() =>
      sut.execute({
        email: "homepet@example.com",
        password: "3455734",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
