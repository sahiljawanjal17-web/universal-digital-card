/** `module` block for the photographer role — docs/03-CONFIG-SCHEMA.md. */
import { z } from 'zod';
import { MediaRefSchema } from '../common.schema';

export const PhotographerModuleSchema = z.object({
  availability: z.object({
    booked: z.array(z.iso.date()).default([]),
    tentative: z.array(z.iso.date()).default([]),
    leadDays: z.number().int().nonnegative(),
  }),
  packages: z
    .array(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        price: z.number().nonnegative(),
        days: z.number().int().positive(),
        includes: z.array(z.string().min(1)).default([]),
        popular: z.boolean().default(false),
      }),
    )
    .min(1),
  addons: z
    .array(
      z.object({ id: z.string().min(1), name: z.string().min(1), price: z.number().nonnegative() }),
    )
    .default([]),
  styles: z.array(z.string().min(1)).default([]),
  albums: z
    .array(
      z.object({
        title: z.string().min(1),
        cover: MediaRefSchema,
        photos: z.array(MediaRefSchema).default([]),
      }),
    )
    .default([]),
  showreel: z.object({ url: MediaRefSchema, poster: MediaRefSchema }),
  travelCities: z.array(z.string().min(1)).default([]),
});

export type PhotographerModule = z.infer<typeof PhotographerModuleSchema>;
