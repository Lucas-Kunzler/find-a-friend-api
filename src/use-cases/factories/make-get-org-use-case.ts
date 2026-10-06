import { PrismaOrgsRepository } from "@/repositories/prisma/prisma-orgs-repository.js";
import { GetOrgUseCase } from "../orgs/get-org.js";

export function makeGetOrgUseCase() {
  const orgsRepository = new PrismaOrgsRepository();
  return new GetOrgUseCase(orgsRepository);
}
