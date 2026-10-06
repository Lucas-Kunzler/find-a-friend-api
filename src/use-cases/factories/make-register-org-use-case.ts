import { PrismaOrgsRepository } from "@/repositories/prisma/prisma-orgs-repository.js";
import { RegisterOrgsUseCase } from "../orgs/register-org.js";

export function makeRegisterOrgUseCase() {
  const orgsRepository = new PrismaOrgsRepository();
  const registerOrgsUseCase = new RegisterOrgsUseCase(orgsRepository);

  return registerOrgsUseCase;
}
