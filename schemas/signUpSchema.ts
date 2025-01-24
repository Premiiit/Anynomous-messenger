import {z} from 'zod';

export const usernameValidation = z.string()
    .min(3)
    .max(255)
    .regex(/^[a-zA-Z0-9_]*$/, "Username can only contain alphanumeric characters and underscores");

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email(),
    password: z.string().min(4),
    // confirmPassword: z.string().min(4),
});