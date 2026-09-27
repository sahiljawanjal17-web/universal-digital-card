'use client';

import { useRole } from '@/lib/hooks/useRole';
import { formatAddress, type BusinessHour } from '@/lib/utils';
import type { DoctorModule } from '../types';

export interface DoctorModuleState {
  module: DoctorModule;
  hours: BusinessHour[];
  /** Clinic / practice name — the attribution line of every message. */
  business: string;
  whatsapp: string;
  /** Treatment names the visitor can pick as a reason for the visit. */
  services: { id: string; title: string }[];
  /** Street address, used as the calendar event's location. */
  location: string;
  /** Google Business profile / review link; empty when the clinic has none. */
  reviewUrl: string;
}

/** The one place a doctor widget reaches into the resolved config. */
export function useDoctorModule(): DoctorModuleState {
  const { data } = useRole();

  return {
    module: data.module as DoctorModule,
    hours: data.contact.hours,
    business: data.profile.name,
    whatsapp: data.contact.whatsapp,
    services: data.services.map((service) => ({ id: service.id, title: service.title })),
    location: formatAddress(data.contact.address),
    reviewUrl: data.contact.socials.googleBusiness,
  };
}
