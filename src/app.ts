import { ZodError } from "zod";
import { env } from "./env/index.js";
import fastify from "fastify";
import { orgsRoutes } from "./http/controllers/orgs/routes.js";
import fastifyJwt from "@fastify/jwt";
import cookie from "@fastify/cookie";
import { petsRoutes } from "./http/controllers/pets/routes.js";
import fastifyMultipart from "@fastify/multipart";
import { ResourceNotFoundError } from "./use-cases/errors/resource-not-found-error.js";

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "refreshToken",
    signed: false,
  },
  sign: {
    expiresIn: "10m",
  },
});

app.register(fastifyMultipart, {
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB por arquivo
  },
});
app.register(cookie);
app.register(orgsRoutes);
app.register(petsRoutes);

app.setErrorHandler((error, _, reply) => {
  console.log("ERROR:", error);
  if (error instanceof ResourceNotFoundError) {
    return reply.status(404).send({
      message: error.message,
    });
  }

  if (
    error instanceof Error &&
    "code" in error &&
    error.code === "FST_REQ_FILE_TOO_LARGE"
  ) {
    return reply.status(400).send({
      message: "Image must be at most 5MB.",
    });
  }

  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "validation error.",
      issues: error.issues.map((issue) => {
        const [first, ...rest] = issue.path;

        const field =
          typeof first === "number"
            ? `images[${first}]${rest.length ? "." + rest.join(".") : ""}`
            : issue.path.join(".");

        return { field, message: issue.message };
      }),
    });
  }

  if (env.NODE_ENV !== "production") {
    console.error(error);
  } else {
    // TODO: Here we should log to an external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: "internal server error." });
});
