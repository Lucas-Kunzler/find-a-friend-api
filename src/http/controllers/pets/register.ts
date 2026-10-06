import {
  PetAge,
  PetEnvironment,
  PetIndependence,
  PetSize,
  PetType,
} from "@/generated/prisma/enums.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeRegisterPetUseCase } from "@/use-cases/factories/make-register-pet-use-case.js";

const registerBodySchema = z.object({
  name: z.string(),
  about: z.string(),
  type: z.enum(PetType),
  age: z.enum(PetAge),
  energy: z.coerce.number().int().min(1).max(5),
  size: z.enum(PetSize),
  independence: z.enum(PetIndependence),
  environment: z.enum(PetEnvironment),
});

const requirementsSchema = z.array(z.string().trim().min(1)).min(1);

const imagesSchema = z
  .array(
    z.object({
      filename: z.string().min(1),
      buffer: z.instanceof(Buffer),
      contentType: z.enum(["image/jpeg", "image/png", "image/webp"], {
        message: "Only JPEG, PNG, and WebP images are allowed.",
      }),
    }),
  )
  .min(1)
  .max(10, {
    message: "You can upload a maximum of 10 images.",
  });

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const fields: Record<string, string> = {};
  const requirements: string[] = [];
  const images: {
    filename: string;
    buffer: Buffer;
    contentType: string;
  }[] = [];

  for await (const part of request.parts()) {
    if (part.type === "file") {
      const buffer = await part.toBuffer();

      images.push({
        filename: part.filename,
        buffer,
        contentType: part.mimetype,
      });
    } else {
      if (part.fieldname === "requirements") {
        requirements.push(String(part.value));
      } else {
        fields[part.fieldname] = String(part.value);
      }
    }
  }

  const body = registerBodySchema.parse(fields);

  const parsedRequirements = requirementsSchema
    .parse(requirements)
    .map((description) => ({
      description,
    }));

  const parsedImages = imagesSchema.parse(images);

  const registerPetUseCase = makeRegisterPetUseCase();

  const { pet } = await registerPetUseCase.execute({
    ...body,
    orgId: request.user.sub,
    images: parsedImages,
    requirements: parsedRequirements,
  });

  return reply.status(201).send({
    pet,
  });
}
