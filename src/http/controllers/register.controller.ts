import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists.error";
import { makeRegisterUseCase } from "@/use-cases/factories/make-register.usecase";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerUserSchema = z.object({
    name: z
      .string()
      .min(3, { message: "Name must be at least 3 characters long" }),
    email: z.string().email({ message: "Email must be an e-mail" }),
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

  const validatedData = registerUserSchema.safeParse(request.body);

  if (!validatedData.success) {
    return reply.status(400).send(validatedData.error.errors);
  }

  const { name, email, password } = validatedData.data;

  try {
    const registerUseCase = makeRegisterUseCase();

    await registerUseCase.execute({
      name,
      email,
      password,
    });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send(error.message);
    }

    throw error;
  }

  return reply.status(201).send();
}
