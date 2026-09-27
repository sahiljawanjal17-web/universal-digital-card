'use client';

import { useState } from 'react';
import { BookOpen, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DisclaimerNote } from '@/components/shared';
import { cn } from '@/lib/utils';
import { useRole } from '@/lib/hooks/useRole';
import { openIntent } from '@/core/whatsapp';
import type { Property } from '../types';
import { propertyFields } from '../lib/wa-templates';

/**
 * R15 — soft gate: name + phone → `brochure_request` WhatsApp intent.
 * On submit the agent can reply with the PDF link (no server upload needed).
 */
export function BrochureGate({ property }: { property: Property }) {
  const { data } = useRole();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const phonePattern = /^\+?[0-9]{10,13}$/;
  const isValid = name.trim().length >= 2 && phonePattern.test(phone.replace(/\s/g, ''));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) {
      setError('Please enter a valid name and 10-digit phone number.');
      return;
    }
    setError('');

    openIntent({
      phone: data.contact.whatsapp,
      intent: 'brochure_request',
      business: data.profile.name,
      section: 'propertyDetailDrawer',
      values: [
        ...propertyFields(property),
        ['Your Name', name.trim()],
        ['Your Phone', phone.trim()],
      ],
    });

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-surface p-5 text-center">
        <CheckCircle className="size-10 text-success" aria-hidden />
        <p className="text-body font-medium text-fg">
          Request sent! The agent will share the brochure on WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5"
    >
      <div className="flex items-center gap-2">
        <BookOpen className="size-5 text-brand" aria-hidden />
        <h3 className="text-body-lg font-semibold text-fg">Get Brochure &amp; Floor Plan</h3>
      </div>

      <p className="text-small text-fg-muted">
        Share your contact and we&apos;ll send the PDF on WhatsApp — free, instant.
      </p>

      <div className="flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-small font-medium text-fg">Your name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Rohit Deshmukh"
            autoComplete="name"
            required
            minLength={2}
            className={cn(
              'h-10 rounded-lg border bg-bg px-3 text-small text-fg placeholder:text-fg-subtle',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
              error ? 'border-danger' : 'border-border',
            )}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-small font-medium text-fg">Phone number</span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            autoComplete="tel"
            required
            className={cn(
              'h-10 rounded-lg border bg-bg px-3 text-small text-fg placeholder:text-fg-subtle',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
              error ? 'border-danger' : 'border-border',
            )}
          />
        </label>
      </div>

      {error ? <p className="text-small text-danger">{error}</p> : null}

      <Button type="submit" className="w-full">
        Send Brochure Request on WhatsApp
      </Button>

      <DisclaimerNote>
        We only use your contact to share property documents. We do not sell or share your data.
      </DisclaimerNote>
    </form>
  );
}

