/**
 * Clinic wording for the shared intents (PART-07 §6). Registered at module
 * import time so `core/whatsapp` keeps no role vocabulary of its own.
 */
import {
  buildMessage,
  registerTemplate,
  INTENT_TITLES,
  type MessageField,
  type TemplateBuilder,
} from '@/core/whatsapp';
import { formatINR } from '@/lib/utils';
import type { Treatment } from '../types';

const appointmentBook: TemplateBuilder = (input) =>
  buildMessage({
    title: INTENT_TITLES.appointment_book,
    fields: input.values,
    note: input.note ?? 'Please confirm my slot.',
    business: input.business,
    emoji: '🦷',
  });

const teleconsultBook: TemplateBuilder = (input) =>
  buildMessage({
    title: 'Video Consultation Request',
    fields: input.values,
    note: input.note ?? 'Please share the meeting link.',
    business: input.business,
    emoji: '💻',
  });

/** PART-07 §6 `cost_enquiry` — the estimator's hand-off. */
const costEnquiry: TemplateBuilder = (input) =>
  buildMessage({
    title: 'Treatment Cost Enquiry',
    fields: input.values,
    note: input.note ?? 'Please share the exact cost and the EMI options.',
    business: input.business,
    emoji: '💰',
  });

/**
 * Called once from the module barrel — registration is idempotent. The
 * `pre_appointment_details` message of PART-07 §6 is not a separate intent:
 * its lines ride along inside the `appointment_book` body, so the clinic gets
 * one chat thread per patient instead of two.
 */
export function registerDoctorTemplates(): void {
  registerTemplate('appointment_book', appointmentBook);
  registerTemplate('teleconsult_book', teleconsultBook);
  registerTemplate('quote_request', costEnquiry);
}

/** The `[label, value]` lines that describe one treatment estimate. */
export function treatmentFields(treatment: Treatment, units: number): MessageField[] {
  const unit = treatment.unit ?? 'per treatment';

  return [
    ['Treatment', treatment.name],
    ['Estimated Range', `${formatINR(treatment.min)} – ${formatINR(treatment.max)} ${unit}`],
    ['Quantity', units > 1 ? `${units} × ${unit}` : unit],
    ['Sessions', treatment.sessions],
  ];
}
