import type { Org, Prisma } from "@/generated/prisma/client.js";
import type { OrgsRepository } from "../orgs-repository.js";
import { randomUUID } from "node:crypto";

export class InMemoryOrgsRepository implements OrgsRepository {
  public items: Org[] = [];

  async findMany(page: number): Promise<Org[]> {
    const startIndex = (page - 1) * 20;
    const endIndex = startIndex + 20;
    return this.items.slice(startIndex, endIndex);
  }

  async update(id: string, data: Prisma.OrgUpdateInput): Promise<Org> {
    const org = this.items.find((item) => item.id === id);

    if (!org) {
      throw new Error("Organization not found.");
    }

    Object.assign(org, data);

    return org;
  }

  async findById(id: string): Promise<Org | null> {
    const org = this.items.find((item) => item.id === id);

    if (!org) {
      return null;
    }

    return org;
  }

  async findByEmail(email: string): Promise<Org | null> {
    const org = this.items.find((item) => item.email === email);

    if (!org) {
      return null;
    }

    return org;
  }

  async create(data: Prisma.OrgCreateInput): Promise<Org> {
    const org = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      cep: data.cep,
      address: data.address,
      city: data.city,
      state: data.state,
      whatsapp: data.whatsapp,
      password_hash: data.password_hash,
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.items.push(org);

    return org;
  }
}
