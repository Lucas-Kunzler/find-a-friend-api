import { InMemoryPetsRepository } from "@/repositories/in-memory/in-memory-pets-repository.js";
import { RegisterPetsUseCase } from "./register-pet.js";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryOrgsRepository } from "@/repositories/in-memory/in-memory-orgs-repository.js";
import { InMemoryStorage } from "@/storage/in-memory-storage.js";
import { ResourceNotFoundError } from "../errors/resource-not-found-error.js";
import { makeOrg } from "@/utils/test/make-org.js";

let petsRepository: InMemoryPetsRepository;
let orgsRepository: InMemoryOrgsRepository;
let storage: InMemoryStorage;
let sut: RegisterPetsUseCase;

describe("Register Pet Use Case", () => {
  beforeEach(async () => {
    orgsRepository = new InMemoryOrgsRepository();
    petsRepository = new InMemoryPetsRepository(orgsRepository);
    storage = new InMemoryStorage();
    sut = new RegisterPetsUseCase(petsRepository, orgsRepository, storage);
  });

  it("should be able to register", async () => {
    const org = await makeOrg(orgsRepository);

    const { pet } = await sut.execute({
      name: "Rex",
      about: "Um cachorro muito amigável",
      type: "DOG",
      age: "ADULT",
      energy: 5,
      size: "LARGE",
      independence: "HIGH",
      environment: "LARGE",
      orgId: org.id,
      images: [
        {
          filename: "rex-1.jpg",
          buffer: Buffer.from("image 1"),
          contentType: "image/jpeg",
        },
        {
          filename: "rex-2.jpg",
          buffer: Buffer.from("image 2"),
          contentType: "image/jpeg",
        },
      ],
      requirements: [
        { description: "Ter espaço amplo" },
        { description: "Ter disponibilidade para passeios" },
      ],
    });

    const storedPet = petsRepository.items.find((item) => item.id === pet.id);

    await expect(pet.orgId).toEqual(expect.any(String));
    expect(pet).toEqual(
      expect.objectContaining({
        name: "Rex",
        orgId: org.id,
      }),
    );
    expect(storedPet).toBeDefined();

    expect(storedPet!.images).toHaveLength(2);
    expect(storedPet!.requirements).toHaveLength(2);

    expect(storage.files).toHaveLength(2);

    expect(storage.files[0]).toEqual({
      filename: "rex-1.jpg",
      buffer: Buffer.from("image 1"),
      contentType: "image/jpeg",
      url: "http://storage.test/rex-1.jpg",
    });
    expect(storage.files[1]).toEqual({
      filename: "rex-2.jpg",
      buffer: Buffer.from("image 2"),
      contentType: "image/jpeg",
      url: "http://storage.test/rex-2.jpg",
    });
    expect(storedPet!.images).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          url: "http://storage.test/rex-1.jpg",
        }),
        expect.objectContaining({
          url: "http://storage.test/rex-2.jpg",
        }),
      ]),
    );
  });

  it("should not be able to register a pet with a non-existent org", async () => {
    await expect(
      sut.execute({
        name: "Rex",
        about: "Um cachorro muito amigável",
        type: "DOG",
        age: "ADULT",
        energy: 5,
        size: "LARGE",
        independence: "HIGH",
        environment: "LARGE",

        orgId: "org-inexistente",

        images: [],
        requirements: [
          {
            description: "Ter espaço amplo",
          },
        ],
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not save images if the org does not exist", async () => {
    await expect(
      sut.execute({
        name: "Rex",
        about: "Um cachorro muito amigável",
        type: "DOG",
        age: "ADULT",
        energy: 5,
        size: "LARGE",
        independence: "HIGH",
        environment: "LARGE",
        orgId: "org-inexistente",
        images: [
          {
            filename: "rex.jpg",
            buffer: Buffer.from("image"),
            contentType: "image/jpeg",
          },
        ],
        requirements: [
          {
            description: "Ter espaço amplo",
          },
        ],
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);

    expect(storage.files).toHaveLength(0);
  });

  it("should create a pet with empty images and requirements when they are not provided", async () => {
    const org = await makeOrg(orgsRepository);

    const { pet } = await sut.execute({
      name: "Rex",
      about: "Um cachorro muito amigável",
      type: "DOG",
      age: "ADULT",
      energy: 5,
      size: "LARGE",
      independence: "HIGH",
      environment: "LARGE",
      orgId: org.id,
    });

    const storedPet = petsRepository.items.find((item) => item.id === pet.id);

    expect(storedPet).toBeDefined();
    expect(storedPet!.images).toHaveLength(0);
    expect(storedPet!.requirements).toHaveLength(0);
    expect(storage.files).toHaveLength(0);
  });
});
