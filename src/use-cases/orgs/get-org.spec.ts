import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryOrgsRepository } from "@/repositories/in-memory/in-memory-orgs-repository.js";
import { GetOrgUseCase } from "./get-org.js";
import { ResourceNotFoundError } from "../errors/resource-not-found-error.js";
import { makeOrg } from "@/utils/test/make-org.js";

let orgsRepository: InMemoryOrgsRepository;
let sut: GetOrgUseCase;

describe("Get Org Use Case", () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository();
    sut = new GetOrgUseCase(orgsRepository);
  });

  it("should be able to get an org by id", async () => {
    const createdOrg = await makeOrg(orgsRepository);

    const { org } = await sut.execute({ orgId: createdOrg.id });

    expect(org).toEqual(
      expect.objectContaining({
        id: createdOrg.id,
        name: "Home Pet NH",
        email: "homepet@example.com",
      }),
    );
  });

  it("should not be able to get an org that does not exist", async () => {
    await expect(() =>
      sut.execute({ orgId: "non-existing-id" }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
