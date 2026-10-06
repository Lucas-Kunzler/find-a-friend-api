import { PrismaOrgsRepository } from "@/repositories/prisma/prisma-orgs-repository.js";
import { UpdateOrgUseCase } from "../orgs/update-org.js";

export function makeUpdateOrgUseCase() {
  const orgsRepository = new PrismaOrgsRepository();
  const updateOrgUseCase = new UpdateOrgUseCase(orgsRepository);

  return updateOrgUseCase;
}
