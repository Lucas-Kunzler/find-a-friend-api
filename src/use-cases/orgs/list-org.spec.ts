import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryOrgsRepository } from "@/repositories/in-memory/in-memory-orgs-repository.js";
import { ListOrgsUseCase } from "./list-org.js";
import { makeOrg } from "@/utils/test/make-org.js";

let orgsRepository: InMemoryOrgsRepository;
let sut: ListOrgsUseCase;

describe("List Orgs Use Case", () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository();
    sut = new ListOrgsUseCase(orgsRepository);
  });

  it("should be able to list orgs from a page", async () => {
    await makeOrg(orgsRepository);

    await makeOrg(orgsRepository, {
      name: "Another Org",
      email: "another@example.com",
      cep: "93310-270",
      address: "Rua das Flores, 100",
      city: "Novo Hamburgo",
      state: "RS",
      whatsapp: "(51) 9090-9091",
      password_hash: "hashed-password",
    });

    const { orgs } = await sut.execute({ page: 1 });

    expect(orgs).toHaveLength(2);
    expect(orgs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "Home Pet NH",
          email: "homepet@example.com",
        }),
        expect.objectContaining({
          name: "Another Org",
          email: "another@example.com",
        }),
      ]),
    );
  });

  it("should return an empty list when page has no orgs", async () => {
    const { orgs } = await sut.execute({ page: 99 });

    expect(orgs).toEqual([]);
  });
});
