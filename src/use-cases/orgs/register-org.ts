import type { Org, State } from "@/generated/prisma/client.js";
import type { OrgsRepository } from "@/repositories/orgs-repository.js";
import { hash } from "bcryptjs";
import { OrgAlreadyExistsError } from "../errors/org-already-exists-error.js";

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  cep: string;
  address: string;
  city: string;
  state: State;
  whatsapp: string;
  password: string;
}

interface RegisterUseCaseResponse {
  org: Org;
}

export class RegisterOrgsUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute({
    name,
    email,
    cep,
    address,
    city,
    state,
    whatsapp,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const orgWithSameEmail = await this.orgsRepository.findByEmail(email);
    const password_hash = await hash(password, 6);

    if (orgWithSameEmail) {
      throw new OrgAlreadyExistsError();
    }

    const org = await this.orgsRepository.create({
      name,
      email,
      cep,
      address,
      city,
      state,
      whatsapp,
      password_hash,
    });

    return { org };
  }
}
