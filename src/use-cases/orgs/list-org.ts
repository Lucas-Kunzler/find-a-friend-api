import type { Org } from "@/generated/prisma/client.js";
import type { OrgsRepository } from "@/repositories/orgs-repository.js";

interface ListUseCaseRequest {
  page: number;
}

interface ListUseCaseResponse {
  orgs: Org[];
}

export class ListOrgsUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute({ page }: ListUseCaseRequest): Promise<ListUseCaseResponse> {
    const orgs = await this.orgsRepository.findMany(page);
    return { orgs };
  }
}
