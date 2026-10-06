import type { OrgsRepository } from "@/repositories/orgs-repository.js";
import { ResourceNotFoundError } from "../errors/resource-not-found-error.js";
import type { Org } from "@/generated/prisma/client.js";

interface GetOrgUseCaseRequest {
  orgId: string;
}

interface GetOrgUseCaseResponse {
  org: Org;
}

export class GetOrgUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute({
    orgId,
  }: GetOrgUseCaseRequest): Promise<GetOrgUseCaseResponse> {
    const org = await this.orgsRepository.findById(orgId);

    if (!org) {
      throw new ResourceNotFoundError();
    }

    return { org };
  }
}
