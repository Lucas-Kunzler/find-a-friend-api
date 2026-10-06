import { PrismaClient } from "@/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "@/env/index.js";

const connectionString = env.DATABASE_URL;

const url = new URL(connectionString);

const schema = url.searchParams.get("schema") ?? "public";

const adapter = new PrismaPg(
  {
    connectionString,
  },
  {
    schema,
  },
);

export const prisma = new PrismaClient({
  adapter,
  log: env.NODE_ENV === "dev" ? ["query"] : [],
});
