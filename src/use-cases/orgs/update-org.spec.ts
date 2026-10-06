import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryOrgsRepository } from "@/repositories/in-memory/in-memory-orgs-repository.js";
import { UpdateOrgUseCase } from "./update-org.js";
import { ResourceNotFoundError } from "../errors/resource-not-found-error.js";
import { OrgAlreadyExistsError } from "../errors/org-already-exists-error.js";
import { makeOrg } from "@/utils/test/make-org.js";

let orgsRepository: InMemoryOrgsRepository;
let sut: UpdateOrgUseCase;

describe("Update Org Use Case", () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository();
    sut = new UpdateOrgUseCase(orgsRepository);
  });

  it("should be able to update an org", async () => {
    const org = await makeOrg(orgsRepository);

    const { org: updatedOrg } = await sut.execute({
      orgId: org.id,
      data: {
        name: "Home Pet Novo Hamburgo",
        city: "Novo Hamburgo",
        whatsapp: "(51) 99999-9999",
      },
    });

    expect(updatedOrg).toEqual(
      expect.objectContaining({
        id: org.id,
        name: "Home Pet Novo Hamburgo",
        email: "homepet@example.com",
        city: "Novo Hamburgo",
        whatsapp: "(51) 99999-9999",
      }),
    );
  });

  it("should not be able to update a non-existent org", async () => {
    await expect(
      sut.execute({
        orgId: "org-inexistente",
        data: {
          name: "Home Pet NH",
        },
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should throw an error when repository update is called for a non-existent org", async () => {
    await expect(
      orgsRepository.update("org-inexistente", {
        name: "Home Pet NH",
      }),
    ).rejects.toThrow("Organization not found.");
  });

  it("should be able to update state, address and whatsapp", async () => {
    const org = await makeOrg(orgsRepository);

    const { org: updatedOrg } = await sut.execute({
      orgId: org.id,
      data: {
        state: "RS",
        whatsapp: "(51) 98888-8888",
        address: "Rua das Flores, 123",
      },
    });

    expect(updatedOrg).toEqual(
      expect.objectContaining({
        state: "RS",
        whatsapp: "(51) 98888-8888",
        address: "Rua das Flores, 123",
      }),
    );
  });

  it("should not be able to update an org with an email that is already in use", async () => {
    const org = await makeOrg(orgsRepository);

    await makeOrg(orgsRepository, {
      name: "Another Pet",
      email: "another@example.com",
      cep: "93310-270",
      address: "Rua Castro Alves, 205",
      city: "Novo Hamburgo",
      state: "RS",
      whatsapp: "(51) 8080-8080",
      password_hash: "123456",
    });

    await expect(
      sut.execute({
        orgId: org.id,
        data: {
          email: "another@example.com",
        },
      }),
    ).rejects.toBeInstanceOf(OrgAlreadyExistsError);
  });
});
