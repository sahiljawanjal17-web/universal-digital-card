/** `module` block for the doctor role — docs/03-CONFIG-SCHEMA.md. */
import { z } from 'zod';
import { MediaRefSchema, PhoneSchema } from '../common.schema';

export const SlotPeriodSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  range: z.string().min(1),
  /** Appointments the period holds — the denominator of "3 slots left". */
  capacity: z.number().int().positive().default(8),
});

export const DoctorModuleSchema = z.object({
  slots: z.object({
    days: z.array(z.string().min(1)).min(1),
    periods: z.array(SlotPeriodSchema).min(1),
    unavailable: z
      .array(z.object({ day: z.string().min(1), period: z.string().min(1) }))
      .default([]),
    /**
     * Seats already taken, per day+period. Scarcity is data, never a random
     * number — the same page must scarcity-count the same on server and client.
     */
    booked: z
      .array(
        z.object({
          day: z.string().min(1),
          period: z.string().min(1),
          count: z.number().int().nonnegative(),
        }),
      )
      .default([]),
  }),
  symptomRouter: z
    .array(
      z.object({
        symptom: z.string().min(1),
        department: z.string().min(1),
        urgency: z.enum(['low', 'medium', 'high']),
        /** What the patient should do next — shown on the matched card. */
        advice: z.string().min(1).optional(),
      }),
    )
    .default([]),
  treatments: z
    .array(
      z.object({
        name: z.string().min(1),
        min: z.number().nonnegative(),
        max: z.number().nonnegative(),
        sessions: z.string().min(1),
        duration: z.string().min(1).optional(),
        /** Per-unit wording for the estimate, e.g. `per tooth`. */
        unit: z.string().min(1).optional(),
      }),
    )
    .default([]),
  /** No-cost EMI tenures the clinic offers, in months. */
  emiTenures: z.array(z.number().int().positive()).default([3, 6, 9]),
  beforeAfter: z
    .array(z.object({ before: MediaRefSchema, after: MediaRefSchema, label: z.string().min(1) }))
    .default([]),
  insurancePanels: z.array(z.string().min(1)).default([]),
  /**
   * Year-stamped degrees, registrations and fellowships for the credentials
   * timeline. `trust` only carries a flat badge list, so the dated history
   * lives here rather than in the shared schema every role validates.
   */
  credentials: z
    .array(
      z.object({
        year: z.number().int().min(1950).max(2100),
        title: z.string().min(1),
        institution: z.string().default(''),
        kind: z
          .enum(['education', 'registration', 'fellowship', 'award', 'membership'])
          .default('education'),
      }),
    )
    .default([]),
  emergency: z.object({ enabled: z.boolean(), number: PhoneSchema }),
  teleconsult: z.object({
    enabled: z.boolean(),
    fee: z.number().nonnegative(),
    platform: z.string().min(1),
  }),
});

export type DoctorModule = z.infer<typeof DoctorModuleSchema>;
