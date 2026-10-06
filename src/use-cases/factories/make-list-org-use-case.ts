import { PrismaOrgsRepository } from "@/repositories/prisma/prisma-orgs-repository.js";
import { ListOrgsUseCase } from "../orgs/list-org.js";

export function makeListOrgsUseCase() {
  const orgsRepository = new PrismaOrgsRepository();
  const listOrgsUseCase = new ListOrgsUseCase(orgsRepository);

  return listOrgsUseCase;
}
