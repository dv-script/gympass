import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials.error";
import { makeAuthenticateUseCase } from "@/use-cases/factories/make-authenticate.usecase";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authenticateUserSchema = z.object({
    email: z.string().email({ message: "Invalid e-mail address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).*$/, {
        message: "Password must contain at least:",
      })
      .regex(/^(?=.*[A-Z]).*$/, {
        message: "- 1 Uppercase letter",
      })
      .regex(/^(?=.*[a-z]).*$/, {
        message: "- 1 Lowercase letter",
      })
      .regex(/^(?=.*[0-9]).*$/, {
        message: "- 1 Number",
      })
      .regex(/^(?=.*[!@#$%^&*]).*$/, {
        message: "- 1 Special character",
      }),
  });

  const validatedData = authenticateUserSchema.safeParse(request.body);

  if (!validatedData.success) {
    return reply.status(400).send(validatedData.error.errors);
  }

  const { email, password } = validatedData.data;

  try {
    const authenticateUseCase = makeAuthenticateUseCase();

    await authenticateUseCase.execute({
      email,
      password,
    });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send(error.message);
    }

    throw error;
  }

  return reply.status(200).send();
}
