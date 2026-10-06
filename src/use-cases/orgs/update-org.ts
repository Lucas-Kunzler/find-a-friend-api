import type { Org, State } from "@/generated/prisma/client.js";
import type { OrgsRepository } from "@/repositories/orgs-repository.js";
import { ResourceNotFoundError } from "../errors/resource-not-found-error.js";
import { OrgAlreadyExistsError } from "../errors/org-already-exists-error.js";

export interface UpdateUseCaseRequest {
  orgId: string;

  data: {
    name?: string | undefined;
    email?: string | undefined;
    cep?: string | undefined;
    address?: string | undefined;
    city?: string | undefined;
    state?: State | undefined;
    whatsapp?: string | undefined;
  };
}

interface UpdateUseCaseResponse {
  org: Org;
}

export class UpdateOrgUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute({
    orgId,
    data,
  }: UpdateUseCaseRequest): Promise<UpdateUseCaseResponse> {
    const org = await this.orgsRepository.findById(orgId);

    if (!org) {
      throw new ResourceNotFoundError();
    }

    if (data.email && data.email !== org.email) {
      const orgWithSameEmail = await this.orgsRepository.findByEmail(
        data.email,
      );

      if (orgWithSameEmail) {
        throw new OrgAlreadyExistsError();
      }
    }

    const updateData = {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.email !== undefined && { email: data.email }),
      ...(data.cep !== undefined && { cep: data.cep }),
      ...(data.address !== undefined && { address: data.address }),
      ...(data.city !== undefined && { city: data.city }),
      ...(data.state !== undefined && { state: data.state }),
      ...(data.whatsapp !== undefined && { whatsapp: data.whatsapp }),
    };

    const updatedOrg = await this.orgsRepository.update(orgId, updateData);

    return { org: updatedOrg };
  }
}
