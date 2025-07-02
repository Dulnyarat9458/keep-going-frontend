import { z } from "zod/v4";


export const SignUpSchema = z
  .object({
    firstName: z.string().min(1, { message: 'First Name is required' }),
    lastName: z.string().min(1, { message: 'Last Name is required' }),
    email: z.string().email().min(1, { message: 'Email is required' }),
    password: z.string().min(6, { message: 'Required more than 6 character' }),
    confirmPassword: z.string().min(1, { message: 'Confirm Password is required' })
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const SignInSchema = z
  .object({
    email: z.string().email().min(1, { message: 'Email is required' }),
    password: z.string().min(6, { message: 'Required more than 6 character' }),
  })

export const ResetPasswordSchema = z
  .object({
    password: z.string().min(6, { message: 'Required more than 6 character' }),
    confirmPassword: z.string().min(1, { message: 'Confirm Password is required' })
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const ForgetPasswordSchema = z
  .object({
    email: z.string().email().min(1, { message: 'Email is required' }),
  })

export const AddHabitSchema = z.object({
  title: z.string().min(1, { message: 'Required' }),
  startDate: z.date().min(1, { message: 'Required' }),
});

export const EditHabitSchema = z.object({
  title: z.string().min(1, { message: 'Required' }),
  startDate: z.date().optional(),
})
