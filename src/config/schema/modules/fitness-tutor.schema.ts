/**
 * `module` block for the fitness-tutor role — docs/03-CONFIG-SCHEMA.md.
 * One module, two variants: `gym` and `tutor`.
 */
import { z } from 'zod';
import { MediaRefSchema } from '../common.schema';

export const FitnessTutorModuleSchema = z.object({
  variant: z.enum(['gym', 'tutor']),
  vipPass: z.object({
    validityDays: z.number().int().positive(),
    perks: z.array(z.string().min(1)).min(1),
    terms: z.string().min(1),
  }),
  programs: z
    .array(
      z.object({
        name: z.string().min(1),
        price: z.number().nonnegative(),
        sessions: z.number().int().positive(),
        level: z.enum(['beginner', 'intermediate', 'advanced', 'all']),
      }),
    )
    .default([]),
  timetable: z
    .array(
      z.object({
        day: z.string().min(1),
        slots: z
          .array(
            z.object({
              time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Expected "HH:MM"'),
              class: z.string().min(1),
              trainer: z.string().min(1),
            }),
          )
          .default([]),
      }),
    )
    .default([]),
  transformations: z
    .array(
      z.object({
        name: z.string().min(1),
        weeks: z.number().int().positive(),
        before: MediaRefSchema,
        after: MediaRefSchema,
        lost: z.string().min(1),
      }),
    )
    .default([]),
  calculators: z.array(z.enum(['bmi', 'bmr', 'tdee'])).default([]),
  tutor: z.object({
    boards: z.array(z.string().min(1)).default([]),
    classes: z.array(z.string().min(1)).default([]),
    subjects: z.array(z.string().min(1)).default([]),
    results: z
      .array(
        z.object({
          year: z.number().int().positive(),
          topper: z.string().min(1),
          score: z.string().min(1),
        }),
      )
      .default([]),
  }),
});

export type FitnessTutorModule = z.infer<typeof FitnessTutorModuleSchema>;
