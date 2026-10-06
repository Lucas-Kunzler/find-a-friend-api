import { InMemoryPetsRepository } from "@/repositories/in-memory/in-memory-pets-repository.js";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryOrgsRepository } from "@/repositories/in-memory/in-memory-orgs-repository.js";
import { ListPetsUseCase } from "./list-pets.js";
import { makeOrg } from "@/utils/test/make-org.js";
import { makePet } from "@/utils/test/make-pet.js";

let petsRepository: InMemoryPetsRepository;
let orgsRepository: InMemoryOrgsRepository;
let sut: ListPetsUseCase;

describe("List Pets Use Case", () => {
  beforeEach(async () => {
    orgsRepository = new InMemoryOrgsRepository();
    petsRepository = new InMemoryPetsRepository(orgsRepository);
    sut = new ListPetsUseCase(petsRepository);

    const org = await makeOrg(orgsRepository);
    await makePet(petsRepository, org.id);
    await makePet(petsRepository, org.id, {
      name: "Roberto",
      about: "Um gato muito amigável",
      type: "CAT",
      age: "PUPPY",
      energy: 2,
      size: "SMALL",
    });
  });

  it("should be able to list pets", async () => {
    const { pets } = await sut.execute({
      city: "Novo Hamburgo",
    });

    await expect(pets).toHaveLength(2);
    await expect(pets[0]).toEqual(
      expect.objectContaining({
        name: "Rex",
        about: "Um cachorro muito amigável",
        type: "DOG",
      }),
    );
  });

  it("should be able to list pets filtered by type", async () => {
    const { pets } = await sut.execute({
      city: "Novo Hamburgo",
      type: "CAT",
    });

    await expect(pets).toHaveLength(1);
    await expect(pets[0]).toEqual(
      expect.objectContaining({
        name: "Roberto",
        about: "Um gato muito amigável",
        type: "CAT",
      }),
    );
  });

  it("should be able to list pets filtered by age", async () => {
    const { pets } = await sut.execute({
      city: "Novo Hamburgo",
      age: "PUPPY",
    });

    expect(pets).toHaveLength(1);
    expect(pets[0]).toEqual(
      expect.objectContaining({
        name: "Roberto",
        age: "PUPPY",
      }),
    );
  });

  it("should be able to list pets filtered by energy", async () => {
    const { pets } = await sut.execute({
      city: "Novo Hamburgo",
      energy: 2,
    });

    expect(pets).toHaveLength(1);
    expect(pets[0]).toEqual(
      expect.objectContaining({
        name: "Roberto",
        energy: 2,
      }),
    );
  });

  it("should be able to list pets filtered by state, independence and environment", async () => {
    const org = await makeOrg(orgsRepository, {
      email: "petstate@example.com",
      state: "RS",
      city: "Novo Hamburgo",
    });

    await makePet(petsRepository, org.id, {
      name: "Milo",
      independence: "LOW",
      environment: "SMALL",
      age: "YOUNG",
    });

    const { pets } = await sut.execute({
      city: "Novo Hamburgo",
      state: "RS",
      independence: "LOW",
      environment: "SMALL",
    });

    expect(pets).toHaveLength(1);
    expect(pets[0]).toEqual(
      expect.objectContaining({
        name: "Milo",
        independence: "LOW",
        environment: "SMALL",
      }),
    );
  });

  it("should be able to list pets filtered by size", async () => {
    const { pets } = await sut.execute({
      city: "Novo Hamburgo",
      size: "SMALL",
    });

    expect(pets).toHaveLength(1);
    expect(pets[0]).toEqual(
      expect.objectContaining({
        name: "Roberto",
        size: "SMALL",
      }),
    );
  });

  it("should not be able to list pets from another city", async () => {
    const { pets } = await sut.execute({
      city: "Canoas",
    });

    expect(pets).toHaveLength(0);
  });

  it("should not be able to list pets from another city", async () => {
    const org = await makeOrg(orgsRepository, {
      email: "pethouse@example.com",
      city: "Canoas",
    });

    await makePet(petsRepository, org.id, {
      name: "Bob",
    });

    const { pets } = await sut.execute({
      city: "Novo Hamburgo",
    });

    expect(pets).toHaveLength(2);

    expect(pets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "Rex",
        }),
        expect.objectContaining({
          name: "Roberto",
        }),
      ]),
    );

    expect(pets).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "Bob",
        }),
      ]),
    );
  });

  it("should ignore pets whose organization no longer exists", async () => {
    const org = await makeOrg(orgsRepository, {
      email: "ghost@example.com",
      city: "Novo Hamburgo",
    });

    await makePet(petsRepository, org.id, {
      name: "Ghost",
    });

    orgsRepository.items = [];

    const pets = await petsRepository.findMany({
      city: "Novo Hamburgo",
    });

    expect(pets).toHaveLength(0);
  });
});
