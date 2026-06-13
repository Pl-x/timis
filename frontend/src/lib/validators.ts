import { z } from 'zod';

export const phoneSchema = z
  .string()
  .regex(/^254[17]\d{8}$/, 'Phone must be 254 followed by 9 digits (e.g. 254712345678)');

export const kraPinSchema = z
  .string()
  .regex(/^[AP]\d{9}[A-Z]$/, 'Invalid KRA PIN format (e.g. A123456789B)');

export const emailSchema = z.string().email('Invalid email address');

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: emailSchema,
  phone: phoneSchema,
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['tenant', 'landlord', 'agent']),
});

export const paymentSchema = z.object({
  phone: phoneSchema,
  amount: z.number().min(1, 'Amount must be at least KES 1'),
  leaseId: z.string().min(1),
});

export const unitSchema = z.object({
  name: z.string().min(1, 'Unit name is required'),
  type: z.string().min(1, 'Unit type is required'),
  rent: z.number().min(0),
  county: z.string().min(1, 'County is required'),
});

export const tenantSchema = z.object({
  name: z.string().min(2),
  email: emailSchema,
  phone: phoneSchema,
  kraPin: kraPinSchema.optional(),
});
