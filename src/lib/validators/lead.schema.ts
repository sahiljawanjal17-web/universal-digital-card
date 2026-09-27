/**
 * Wire format for `POST /api/lead`. Shared by the route and (from PART-04) the
 * lead form's resolver, so client and server can never drift.
 */
import { z } from 'zod';
import { ROLE_KEYS } from '@/types/role';
import { INTENT_KEYS } from '@/lib/constants/intents';

export const LeadPayloadSchema = z.object({
  intent: z.enum(INTENT_KEYS),
  role: z.enum(ROLE_KEYS).optional(),
  name: z.string().min(2).max(80),
  /** Loose on input — the server normalises to E.164 before use. */
  phone: z.string().min(8).max(20),
  email: z.email().optional(),
  message: z.string().max(1000).optional(),
  /** Extra intent-specific answers, kept flat so they render as message lines. */
  extras: z.record(z.string().min(1), z.string().max(300)).default({}),
  consent: z.boolean().refine((v) => v, 'Consent is required'),
  /** Where the lead came from, e.g. `hero-cta`. */
  source: z.string().max(60).optional(),
});

export type LeadPayload = z.infer<typeof LeadPayloadSchema>;
