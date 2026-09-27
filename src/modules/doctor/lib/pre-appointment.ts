/**
 * PART-07 §6 `pre_appointment_details`. Not a separate intent: these lines
 * ride inside the `appointment_book` body, so the clinic gets one thread per
 * patient. Every field is optional — an empty form adds no lines at all.
 */
import type { MessageField } from '@/core/whatsapp';

export const GENDERS = ['Female', 'Male', 'Other'] as const;
export type Gender = (typeof GENDERS)[number];

export interface PreAppointmentDetails {
  age: string;
  gender: Gender | '';
  symptom: string;
  duration: string;
  conditions: string;
  medication: string;
}

export const EMPTY_PRE_APPOINTMENT: PreAppointmentDetails = {
  age: '',
  gender: '',
  symptom: '',
  duration: '',
  conditions: '',
  medication: '',
};

/** Ages outside 0–120 are typos, not patients — they are dropped, not sent. */
function ageLine(age: string): string {
  const value = Number.parseInt(age, 10);
  return Number.isFinite(value) && value >= 0 && value <= 120 ? String(value) : '';
}

export function preAppointmentFields(details: PreAppointmentDetails): MessageField[] {
  const age = ageLine(details.age.trim());
  const ageGender = [age, details.gender].filter(Boolean).join(' · ');

  const lines: MessageField[] = [
    ['Age', ageGender],
    ['Symptom', details.symptom.trim()],
    ['Duration', details.duration.trim()],
    ['Existing Conditions', details.conditions.trim()],
    ['Current Medication', details.medication.trim()],
  ];

  return lines.filter(([, value]) => typeof value === 'string' && value.length > 0);
}
