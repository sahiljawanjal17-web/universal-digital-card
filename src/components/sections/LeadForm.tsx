'use client';

import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { SectionShell } from './SectionShell';
import { Button } from '@/components/ui/button';
import { ConfettiButton } from '@/components/motion';
import { ConsentCheckbox, LeadField, PhoneField } from '@/components/shared';
import { EVENTS, track } from '@/core/analytics';
import { openIntent, type MessageField } from '@/core/whatsapp';
import { useRole } from '@/lib/hooks/useRole';
import {
  buildLeadFormSchema,
  isLeadFieldKey,
  LEAD_FIELDS,
  type LeadFieldKey,
  type LeadFormValues,
} from '@/lib/constants/lead-fields';
import { getIcon } from '@/lib/icons';

const SECTION = 'leadForm';

const EMPTY: LeadFormValues = {
  name: '',
  phone: '',
  email: '',
  city: '',
  concern: '',
  preferredTime: '',
  budget: '',
  message: '',
  consent: false,
  website: '',
};

/**
 * The page's main conversion point. Which questions appear comes from
 * `data.leadForm.fields`, and a valid submit is handed straight to the
 * WhatsApp router — there is no inbox to check and nothing to wait for.
 */
export function LeadForm() {
  const { data } = useRole();
  const { leadForm, profile, contact } = data;
  const [sent, setSent] = useState(false);
  const [started, setStarted] = useState(false);

  const fields = useMemo(() => leadForm.fields.filter(isLeadFieldKey), [leadForm.fields]);
  const schema = useMemo(() => buildLeadFormSchema(fields), [fields]);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({ resolver: zodResolver(schema), defaultValues: EMPTY });

  const onStart = () => {
    if (started) return;
    setStarted(true);
    track(EVENTS.LEAD_START, { section: SECTION, intent: leadForm.intent });
  };

  const onSubmit = handleSubmit((values) => {
    if (values.website) return; // honeypot: a bot filled the hidden field
    track(EVENTS.LEAD_SUBMIT, { section: SECTION, intent: leadForm.intent, fields: fields.length });

    openIntent({
      phone: contact.whatsapp,
      intent: leadForm.intent,
      business: profile.name,
      values: toMessageFields(fields, values),
      note: values.message || undefined,
      source: SECTION,
      section: SECTION,
    });

    setSent(true);
  });

  const CheckIcon = getIcon('circle-check-big');

  return (
    <SectionShell
      sectionKey={SECTION}
      eyebrow="Get in touch"
      title={leadForm.title}
      subtitle={leadForm.subtitle || undefined}
      tone="raised"
      fabHide
      innerClassName="max-w-2xl"
    >
      {sent ? (
        <div className="surface-card flex flex-col items-center gap-4 p-10 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-success/15 text-success">
            <CheckIcon className="size-6" aria-hidden />
          </span>
          <h3 className="font-display text-h2 text-fg">WhatsApp is open</h3>
          <p className="text-body text-fg-muted">
            Your details are already in the chat — just press send.
          </p>
          <ConfettiButton onClick={() => setSent(false)} className="text-small">
            Send another enquiry
          </ConfettiButton>
        </div>
      ) : (
        <form noValidate onSubmit={onSubmit} onFocus={onStart} className="flex flex-col gap-5">
          <input
            {...register('website')}
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            className="sr-only"
          />

          <div className="grid gap-5 sm:grid-cols-2">
            {fields.map((key) => {
              const def = LEAD_FIELDS[key];
              const error = errors[key]?.message;

              if (def.control === 'phone') {
                return (
                  <Controller
                    key={key}
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <PhoneField
                        id="lead-phone"
                        label={def.label}
                        required
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={error}
                      />
                    )}
                  />
                );
              }

              return (
                <LeadField
                  key={key}
                  id={`lead-${key}`}
                  def={def}
                  error={error}
                  registration={register(key)}
                />
              );
            })}
          </div>

          <Controller
            name="consent"
            control={control}
            render={({ field }) => (
              <ConsentCheckbox
                id="lead-consent"
                text={leadForm.consentText}
                checked={field.value}
                onChange={field.onChange}
                error={errors.consent?.message}
              />
            )}
          />

          <Button type="submit" size="lg" disabled={isSubmitting} className="h-11 w-full text-body">
            {isSubmitting ? 'Opening WhatsApp…' : 'Send on WhatsApp'}
          </Button>
        </form>
      )}
    </SectionShell>
  );
}

/** Only answered, non-message fields become message lines. */
function toMessageFields(fields: LeadFieldKey[], values: LeadFormValues): MessageField[] {
  return fields
    .filter((key) => key !== 'message' && values[key].trim())
    .map((key) => [LEAD_FIELDS[key].label, values[key].trim()] as MessageField);
}
