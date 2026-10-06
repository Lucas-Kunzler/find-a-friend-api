import { PrismaClient } from "@/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL!;

const url = new URL(connectionString);

const schema = url.searchParams.get("schema") ?? undefined;

const adapter = new PrismaPg(
  {
    connectionString,
  },
  {
    schema: schema!,
  },
);

export const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === "dev" ? ["query"] : [],
});
