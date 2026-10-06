import type { Org, Prisma } from "@/generated/prisma/client.js";
import type { OrgCreateInput } from "@/generated/prisma/models.js";
import type { OrgsRepository } from "../orgs-repository.js";
import { prisma } from "@/lib/prisma.js";

export class PrismaOrgsRepository implements OrgsRepository {
  async findMany(page: number): Promise<Org[]> {
    const orgs = await prisma.org.findMany({
      skip: (page - 1) * 20,
      take: 20,
    });
    return orgs;
  }
  async update(id: string, data: Prisma.OrgUpdateInput): Promise<Org> {
    const org = await prisma.org.update({
      where: {
        id,
      },
      data,
    });

    return org;
  }
  async findById(id: string): Promise<Org | null> {
    const org = await prisma.org.findUnique({
      where: {
        id,
      },
    });

    return org;
  }
  async create(data: OrgCreateInput): Promise<Org> {
    const org = await prisma.org.create({
      data,
    });
    return org;
  }

  async findByEmail(email: string): Promise<Org | null> {
    const org = await prisma.org.findUnique({
      where: {
        email,
      },
    });

    return org;
  }
}
