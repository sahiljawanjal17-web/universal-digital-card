'use client';

import type { UseFormRegisterReturn } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { LeadFieldDef } from '@/lib/constants/lead-fields';
import { cn } from '@/lib/utils';

/**
 * One text-ish lead field. The definition decides the control, so the form
 * itself never grows a branch per question — phone is the only exception and
 * it has its own `<PhoneField/>`.
 */
export function LeadField({
  id,
  def,
  error,
  registration,
}: {
  id: string;
  def: LeadFieldDef;
  error?: string;
  registration: UseFormRegisterReturn;
}) {
  const wide = def.control === 'textarea';
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={cn('flex flex-col gap-2', wide && 'sm:col-span-2')}>
      <Label htmlFor={id}>
        {def.label}
        {def.optional ? null : <span className="text-danger"> *</span>}
      </Label>

      {wide ? (
        <Textarea
          id={id}
          rows={4}
          placeholder={def.placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          {...registration}
        />
      ) : (
        <Input
          id={id}
          type={def.control === 'email' ? 'email' : 'text'}
          placeholder={def.placeholder}
          autoComplete={def.autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          {...registration}
        />
      )}

      {error ? (
        <p id={errorId} className="text-small text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
