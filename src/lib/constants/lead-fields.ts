/**
 * The universal lead-field vocabulary. `data.leadForm.fields` is a list of
 * these keys, so a role chooses which questions it asks without any role ever
 * describing how a field looks or validates.
 */
import { z } from 'zod';

export const LEAD_FIELD_KEYS = [
  'name',
  'phone',
  'email',
  'city',
  'concern',
  'preferredTime',
  'budget',
  'message',
] as const;

export type LeadFieldKey = (typeof LEAD_FIELD_KEYS)[number];

export type LeadFieldDef = {
  label: string;
  /** `phone` renders <PhoneField/>; the rest map to an input or a textarea. */
  control: 'text' | 'email' | 'phone' | 'textarea';
  placeholder: string;
  autoComplete?: string;
  /** Optional fields still get sent — they simply may be left blank. */
  optional?: boolean;
};

export const LEAD_FIELDS: Record<LeadFieldKey, LeadFieldDef> = {
  name: { label: 'Your name', control: 'text', placeholder: 'Full name', autoComplete: 'name' },
  phone: { label: 'WhatsApp number', control: 'phone', placeholder: '98765 43210' },
  email: {
    label: 'Email',
    control: 'email',
    placeholder: 'you@example.com',
    autoComplete: 'email',
    optional: true,
  },
  city: {
    label: 'City',
    control: 'text',
    placeholder: 'Where are you based?',
    autoComplete: 'address-level2',
  },
  concern: { label: 'What do you need help with?', control: 'text', placeholder: 'In one line' },
  preferredTime: {
    label: 'Preferred time to talk',
    control: 'text',
    placeholder: 'e.g. Weekday evenings',
    optional: true,
  },
  budget: { label: 'Budget range', control: 'text', placeholder: 'e.g. ₹50,000 – ₹1,00,000', optional: true },
  message: { label: 'Message', control: 'textarea', placeholder: 'Anything else I should know?', optional: true },
};

export function isLeadFieldKey(value: string): value is LeadFieldKey {
  return (LEAD_FIELD_KEYS as readonly string[]).includes(value);
}

/** Indian mobile numbers, exactly as the lead API expects them. */
export const MOBILE_PATTERN = /^[6-9]\d{9}$/;

const BASE_SHAPE = {
  name: z.string(),
  phone: z.string(),
  email: z.string(),
  city: z.string(),
  concern: z.string(),
  preferredTime: z.string(),
  budget: z.string(),
  message: z.string(),
  consent: z.boolean(),
  /** Honeypot — a real visitor never sees it, so anything here is a bot. */
  website: z.string(),
};

export type LeadFormValues = z.infer<z.ZodObject<typeof BASE_SHAPE>>;

/**
 * Only the fields a role actually renders are required; the rest stay in the
 * value object so the resolver and the message builder share one shape.
 */
export function buildLeadFormSchema(fields: LeadFieldKey[]) {
  const visible = new Set(fields);

  return z.object(BASE_SHAPE).superRefine((values, ctx) => {
    const require = (key: LeadFieldKey, message: string, ok: boolean) => {
      if (visible.has(key) && !LEAD_FIELDS[key].optional && !ok) {
        ctx.addIssue({ code: 'custom', path: [key], message });
      }
    };

    require('name', 'Please enter your name.', values.name.trim().length >= 2);
    require('phone', 'Enter a 10-digit mobile number.', MOBILE_PATTERN.test(values.phone));
    require('city', 'Please enter your city.', values.city.trim().length > 0);
    require('concern', 'Tell me what you need in one line.', values.concern.trim().length > 0);

    if (visible.has('email') && values.email.trim() && !z.email().safeParse(values.email).success) {
      ctx.addIssue({ code: 'custom', path: ['email'], message: 'Enter a valid email address.' });
    }

    if (!values.consent) {
      ctx.addIssue({ code: 'custom', path: ['consent'], message: 'Please accept to continue.' });
    }
  });
}
