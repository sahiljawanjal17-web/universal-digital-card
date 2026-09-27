'use client';

import { useMemo, useState } from 'react';
import { ArrowLeft, CalendarPlus, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SectionShell } from '@/components/sections';
import { PhoneField } from '@/components/shared';
import { VCardButton } from '@/core/vcard';
import { openIntent } from '@/core/whatsapp';
import { trackCta } from '@/core/analytics';
import { cn, formatTime } from '@/lib/utils';
import { useDoctorModule } from '../hooks/useDoctorModule';
import { getAvailableSlots, reasonLabel, slotEnd, slotStart, type SlotOption } from '../lib/slots';
import { buildAppointmentIcs, downloadIcs } from '../lib/ics';
import {
  EMPTY_PRE_APPOINTMENT,
  preAppointmentFields,
  type PreAppointmentDetails,
} from '../lib/pre-appointment';
import { ClinicStatusBadge } from './ClinicStatusBadge';
import { PreAppointmentForm } from './PreAppointmentForm';

const SECTION = 'slotBooking';
const STEPS = ['Day', 'Time', 'Details'] as const;

type PatientType = 'new' | 'existing';

interface PatientDetails {
  name: string;
  phone: string;
  reason: string;
  patientType: PatientType;
}

const EMPTY_DETAILS: PatientDetails = {
  name: '',
  phone: '',
  reason: '',
  patientType: 'new',
};

function StepDots({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-2" aria-label="Booking steps">
      {STEPS.map((label, index) => {
        const state = index < current ? 'done' : index === current ? 'active' : 'todo';
        return (
          <li key={label} className="flex items-center gap-2">
            <span
              aria-current={state === 'active' ? 'step' : undefined}
              className={cn(
                'flex size-7 items-center justify-center rounded-full border text-caption font-semibold',
                state === 'todo' && 'border-border bg-surface text-fg-subtle',
                state === 'active' && 'border-brand bg-brand text-brand-fg',
                state === 'done' && 'border-success bg-success/15 text-success',
              )}
            >
              {index + 1}
            </span>
            <span
              className={cn(
                'text-small',
                state === 'todo' ? 'text-fg-subtle' : 'font-medium text-fg',
              )}
            >
              {label}
            </span>
            {index < STEPS.length - 1 ? (
              <span aria-hidden className="h-px w-4 bg-border sm:w-8" />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

/** "3 slots left" is scarcity only while it is true — see `slots.booked`. */
function SlotsLeftNote({ slot }: { slot: SlotOption }) {
  if (slot.reason) {
    return <span className="text-caption text-fg-subtle">{reasonLabel(slot.reason)}</span>;
  }
  if (slot.slotsLeft <= 3) {
    return <span className="text-caption font-medium text-warning">{slot.slotsLeft} slots left</span>;
  }

  return <span className="text-caption text-fg-subtle">{slot.slotsLeft} slots open</span>;
}

/**
 * D1 — the money widget. Day → period → details → one WhatsApp message that
 * already contains everything the clinic needs to confirm, plus an .ics so the
 * patient actually turns up.
 */
export function SlotBooking() {
  const { module, hours, business, whatsapp, services, location } = useDoctorModule();

  // `now` is frozen for the life of the widget: a grid that silently re-sorted
  // itself under the visitor's finger would move the slot they were tapping.
  const [now] = useState(() => new Date());
  const days = useMemo(
    () => getAvailableSlots(module.slots, hours, now),
    [module.slots, hours, now],
  );

  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<SlotOption | null>(null);
  const [dayKey, setDayKey] = useState<string | null>(null);
  const [details, setDetails] = useState<PatientDetails>(EMPTY_DETAILS);
  const [preDetails, setPreDetails] = useState<PreAppointmentDetails>(EMPTY_PRE_APPOINTMENT);
  const [confirmed, setConfirmed] = useState<SlotOption | null>(null);

  const activeDay = days.find((day) => day.day === dayKey) ?? null;
  const canConfirm = details.name.trim().length > 1 && details.phone.length === 10 && selected;

  function reset() {
    setStep(0);
    setSelected(null);
    setDayKey(null);
    setDetails(EMPTY_DETAILS);
    setPreDetails(EMPTY_PRE_APPOINTMENT);
    setConfirmed(null);
  }

  function handleConfirm() {
    if (!selected || !canConfirm) return;

    trackCta('Confirm on WhatsApp', SECTION, { intent: 'appointment_book' });
    openIntent({
      phone: whatsapp,
      intent: 'appointment_book',
      business,
      section: SECTION,
      source: SECTION,
      values: [
        ['Date', selected.dayLabel],
        ['Time', `${selected.periodLabel} (${selected.range})`],
        ['Name', details.name.trim()],
        ['Phone', `+91 ${details.phone}`],
        ['Patient Type', details.patientType === 'new' ? 'New' : 'Existing'],
        ['Reason', details.reason || 'General consultation'],
        ...preAppointmentFields(preDetails),
      ],
    });
    setConfirmed(selected);
  }

  function handleAddToCalendar() {
    if (!confirmed) return;

    trackCta('Add to Calendar', SECTION);
    downloadIcs(
      `appointment-${confirmed.date.year}-${confirmed.date.month}-${confirmed.date.day}`,
      buildAppointmentIcs({
        start: slotStart(confirmed),
        end: slotEnd(confirmed),
        title: `Appointment — ${business}`,
        description: `${details.reason || 'Consultation'} · ${confirmed.periodLabel} (${confirmed.range})`,
        location,
        uid: `${confirmed.day}-${confirmed.period}-${confirmed.date.year}${confirmed.date.month}${confirmed.date.day}@${business.replace(/\s+/g, '-').toLowerCase()}`,
      }),
    );
  }

  if (confirmed) {
    return (
      <SectionShell sectionKey={SECTION} eyebrow="Appointment" title="Your slot is on its way">
        <div className="surface-card mx-auto flex max-w-xl flex-col items-center gap-4 p-6 text-center sm:p-8">
          <CheckCircle2 className="size-12 text-success" aria-hidden />
          <div>
            <p className="text-body-lg font-semibold text-fg">
              {confirmed.dayLabel} · {confirmed.periodLabel}
            </p>
            <p className="text-small text-fg-muted">{confirmed.range}</p>
          </div>
          <p className="text-small text-fg-muted">
            We have opened WhatsApp with your request. The clinic confirms the exact time by reply.
          </p>

          <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
            <Button type="button" onClick={handleAddToCalendar} className="h-11">
              <CalendarPlus className="size-4" aria-hidden />
              Add to Calendar
            </Button>
            <VCardButton label="Save doctor's contact" variant="outline" className="h-11" />
          </div>

          <button
            type="button"
            onClick={reset}
            className="text-small text-fg-subtle underline underline-offset-4 hover:text-fg"
          >
            Book another slot
          </button>
        </div>
      </SectionShell>
    );
  }

  return (
    <SectionShell
      sectionKey={SECTION}
      eyebrow="Book in 30 seconds"
      title="Pick a slot that suits you"
      subtitle="No forms, no call-backs — choose a day and a time, and the clinic confirms on WhatsApp."
      headingSlot={<ClinicStatusBadge hours={hours} />}
    >
      <div className="surface-card mx-auto flex max-w-2xl flex-col gap-6 p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <StepDots current={step} />
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep((value) => value - 1)}
              className="inline-flex items-center gap-1 text-small text-fg-muted hover:text-fg"
            >
              <ArrowLeft className="size-4" aria-hidden />
              Back
            </button>
          ) : null}
        </div>

        {step === 0 ? (
          <fieldset className="flex flex-col gap-3">
            <legend className="mb-2 text-small text-fg-muted">Which day works for you?</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {days.map((day) => (
                <button
                  key={day.day}
                  type="button"
                  disabled={!day.available}
                  aria-pressed={dayKey === day.day}
                  onClick={() => {
                    setDayKey(day.day);
                    setSelected(null);
                    setStep(1);
                  }}
                  className={cn(
                    'flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition-colors',
                    dayKey === day.day
                      ? 'border-brand bg-brand/10'
                      : 'border-border bg-surface hover:border-brand hover:bg-surface-2',
                    !day.available && 'cursor-not-allowed opacity-50 hover:border-border hover:bg-surface',
                  )}
                >
                  <span className="text-body-lg font-semibold text-fg">{day.label}</span>
                  <span className="text-small text-fg-muted">
                    {day.available
                      ? `${day.periods.filter((period) => period.available).length} of ${day.periods.length} sessions open`
                      : 'Fully booked'}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>
        ) : null}

        {step === 1 && activeDay ? (
          <fieldset className="flex flex-col gap-3">
            <legend className="mb-2 text-small text-fg-muted">
              {activeDay.label} — pick a session
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {activeDay.periods.map((slot) => (
                <button
                  key={slot.period}
                  type="button"
                  disabled={!slot.available}
                  aria-pressed={selected?.period === slot.period}
                  onClick={() => {
                    setSelected(slot);
                    setStep(2);
                  }}
                  className={cn(
                    'flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition-colors',
                    selected?.period === slot.period
                      ? 'border-brand bg-brand/10'
                      : 'border-border bg-surface hover:border-brand hover:bg-surface-2',
                    !slot.available &&
                      'cursor-not-allowed opacity-50 hover:border-border hover:bg-surface',
                  )}
                >
                  <span className="inline-flex items-center gap-2 text-body font-semibold text-fg">
                    <Clock className="size-4 text-brand" aria-hidden />
                    {slot.periodLabel}
                  </span>
                  <span className="text-small text-fg-muted">{slot.range}</span>
                  <SlotsLeftNote slot={slot} />
                </button>
              ))}
            </div>
          </fieldset>
        ) : null}

        {step === 2 && selected ? (
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-border bg-surface-2 p-4">
              <p className="text-caption tracking-wide text-fg-subtle uppercase">Your slot</p>
              <p className="text-body-lg font-semibold text-fg">
                {selected.dayLabel} · {selected.periodLabel}
              </p>
              <p className="text-small text-fg-muted">
                {selected.range} · arrive {formatTime(Math.max(0, selected.startMinutes - 10))} for
                paperwork
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="booking-name">
                  Full name<span className="text-danger"> *</span>
                </Label>
                <Input
                  id="booking-name"
                  autoComplete="name"
                  placeholder="Rohit Deshmukh"
                  value={details.name}
                  onChange={(event) =>
                    setDetails((prev) => ({ ...prev, name: event.target.value }))
                  }
                />
              </div>

              <PhoneField
                id="booking-phone"
                label="Mobile"
                required
                value={details.phone}
                onChange={(value) => setDetails((prev) => ({ ...prev, phone: value }))}
              />

              <div className="flex flex-col gap-2">
                <Label htmlFor="booking-reason">Reason for visit</Label>
                <select
                  id="booking-reason"
                  value={details.reason}
                  onChange={(event) =>
                    setDetails((prev) => ({ ...prev, reason: event.target.value }))
                  }
                  className="h-10 rounded-lg border border-border bg-surface px-3 text-body text-fg"
                >
                  <option value="">General consultation</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.title}>
                      {service.title}
                    </option>
                  ))}
                </select>
              </div>

              <fieldset className="flex flex-col gap-2">
                <legend className="mb-2 text-small font-medium text-fg">Patient type</legend>
                <div className="flex gap-2">
                  {(['new', 'existing'] as PatientType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      aria-pressed={details.patientType === type}
                      onClick={() => setDetails((prev) => ({ ...prev, patientType: type }))}
                      className={cn(
                        'flex-1 rounded-lg border px-3 py-2 text-small capitalize transition-colors',
                        details.patientType === type
                          ? 'border-brand bg-brand text-brand-fg'
                          : 'border-border bg-surface text-fg hover:border-brand',
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </fieldset>

              <PreAppointmentForm
                value={preDetails}
                onChange={setPreDetails}
                className="sm:col-span-2"
              />
            </div>

            <Button
              type="button"
              disabled={!canConfirm}
              onClick={handleConfirm}
              className="h-12 w-full text-body"
            >
              Confirm on WhatsApp
            </Button>
            <p className="text-center text-caption text-fg-subtle">
              Your details go straight to the clinic&apos;s WhatsApp. Nothing is stored on this site.
            </p>
          </div>
        ) : null}
      </div>
    </SectionShell>
  );
}
