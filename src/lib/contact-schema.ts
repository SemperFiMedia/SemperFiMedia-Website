import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(30).optional().or(z.literal('')),
  service: z.enum(['corporate', 'wedding', 'music-video', 'event', 'other']),
  eventDate: z.string().optional().or(z.literal('')),
  budget: z.enum(['under-3k', '3k-5k', '5k-10k', '10k-plus', 'not-sure']).optional(),
  message: z.string().min(10).max(2000),
});

export type ContactPayload = z.infer<typeof contactSchema>;
