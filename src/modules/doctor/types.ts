/**
 * Doctor module types. Every shape is inferred from the zod schema in
 * `src/config/schema/modules/doctor.schema.ts` — a hand-written duplicate of a
 * validated shape is banned (docs/07-CONVENTIONS.md), because a drifting
 * interface would let invalid data type-check.
 */
import type { z } from 'zod';
import type { DoctorModuleSchema, SlotPeriodSchema } from '@/config/schema/modules/doctor.schema';

export type DoctorModule = z.infer<typeof DoctorModuleSchema>;
export type SlotPeriod = z.infer<typeof SlotPeriodSchema>;

export type SlotConfig = DoctorModule['slots'];
export type Symptom = DoctorModule['symptomRouter'][number];
export type Urgency = Symptom['urgency'];
export type Treatment = DoctorModule['treatments'][number];
export type BeforeAfterCase = DoctorModule['beforeAfter'][number];
export type Credential = DoctorModule['credentials'][number];
export type CredentialKind = Credential['kind'];
export type Teleconsult = DoctorModule['teleconsult'];
export type Emergency = DoctorModule['emergency'];
