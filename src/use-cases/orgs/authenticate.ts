import type { OrgsRepository } from "@/repositories/orgs-repository.js";
import { InvalidCredentialsError } from "../errors/invalid-credentials-error.js";
import { compare } from "bcryptjs";
import type { Org } from "@/generated/prisma/client.js";

interface AuthenticateUseCaseRequest {
  email: string;
  password: string;
}

interface AuthenticateUseCaseResponse {
  org: Org;
}

export class AuthenticateUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const org = await this.orgsRepository.findByEmail(email);

    if (!org) {
      throw new InvalidCredentialsError();
    }

    const doesPaswordMatch = await compare(password, org.password_hash);

    if (!doesPaswordMatch) {
      throw new InvalidCredentialsError();
    }

    return {
      org,
    };
  }
}
