/**
 * Doctor role module. `ModuleSlot` lazy-loads this barrel and looks up
 * `widgets[name]` for every `module:<name>` entry in the preset's section list,
 * which is why nothing outside `src/modules/` ever names this role.
 */
import { BeforeAfterGallery } from './components/BeforeAfterGallery';
import { CostEstimator } from './components/CostEstimator';
import { CredentialsTimeline } from './components/CredentialsTimeline';
import { InsurancePanels } from './components/InsurancePanels';
import { ReportUploadCta } from './components/ReportUploadCta';
import { ReviewCta } from './components/ReviewCta';
import { SlotBooking } from './components/SlotBooking';
import { SymptomRouter } from './components/SymptomRouter';
import { TeleconsultCard } from './components/TeleconsultCard';
import { registerDoctorTemplates } from './lib/wa-templates';

export const moduleId = 'doctor' as const;

// Importing the module is what specialises the WhatsApp wording — see
// `src/core/whatsapp/templates/index.ts`.
registerDoctorTemplates();

export const widgets = {
  slotBooking: SlotBooking,
  symptomRouter: SymptomRouter,
  beforeAfterGallery: BeforeAfterGallery,
  costEstimator: CostEstimator,
  insurancePanels: InsurancePanels,
  teleconsult: TeleconsultCard,
  reportUpload: ReportUploadCta,
  credentials: CredentialsTimeline,
  reviewCta: ReviewCta,
} as const;

export type WidgetName = keyof typeof widgets;

export { ClinicStatusBadge } from './components/ClinicStatusBadge';
export { registerDoctorTemplates as waTemplates };
export * from './types';
