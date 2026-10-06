import { InMemoryPetsRepository } from "@/repositories/in-memory/in-memory-pets-repository.js";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryOrgsRepository } from "@/repositories/in-memory/in-memory-orgs-repository.js";
import { ListPetsUseCase } from "./list-pets.js";
import { makeOrg } from "@/utils/test/make-org.js";
import { makePet } from "@/utils/test/make-pet.js";
import { FindPetByIdUseCase } from "./find-pet-by-id.js";
import type { Pet } from "@/generated/prisma/client.js";
import { ResourceNotFoundError } from "../errors/resource-not-found-error.js";

let petsRepository: InMemoryPetsRepository;
let orgsRepository: InMemoryOrgsRepository;
let sut: FindPetByIdUseCase;
let rex: Pet;

describe("Find Pet By Id Use Case", () => {
  beforeEach(async () => {
    orgsRepository = new InMemoryOrgsRepository();
    petsRepository = new InMemoryPetsRepository(orgsRepository);
    sut = new FindPetByIdUseCase(petsRepository);

    const org = await makeOrg(orgsRepository);
    rex = await makePet(petsRepository, org.id);
    await makePet(petsRepository, org.id, {
      name: "Roberto",
      about: "Um gato muito amigável",
      type: "CAT",
      age: "PUPPY",
      energy: 2,
      size: "SMALL",
    });
  });

  it("should be able to find a pet by its id", async () => {
    const { pet } = await sut.execute({ id: rex.id });

    await expect(pet).toEqual(
      expect.objectContaining({
        name: "Rex",
        about: "Um cachorro muito amigável",
        type: "DOG",
      }),
    );
  });

  it("should not be able to find a pet with wrong id", async () => {
    await expect(
      sut.execute({
        id: "id-inexistente",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should return null when the repository does not find a pet by id", async () => {
    const pet = await petsRepository.findById("pet-inexistente");

    expect(pet).toBeNull();
  });
});
