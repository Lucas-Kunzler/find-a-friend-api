import type { Org, Prisma } from "@/generated/prisma/client.js";

export interface OrgsRepository {
  findMany(page: number): Promise<Org[]>;
  findById(id: string): Promise<Org | null>;
  findByEmail(email: string): Promise<Org | null>;
  update(id: string, data: Prisma.OrgUpdateInput): Promise<Org>;
  create(data: Prisma.OrgCreateInput): Promise<Org>;
}
