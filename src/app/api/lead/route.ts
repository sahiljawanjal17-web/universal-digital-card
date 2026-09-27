/**
 * Phase 1 lead sink: validate → log → hand back the WhatsApp link.
 * No database and no notification yet (docs/parts/PART-03 §4.6).
 *
 * TODO(part-13): rate-limit by IP before this is exposed on a real domain.
 */
import { NextResponse } from 'next/server';
import { resolveConfig } from '@/config';
import { buildIntentMessage, buildWhatsAppLink } from '@/core/whatsapp';
import type { MessageField } from '@/core/whatsapp';
import { formatPhone } from '@/lib/utils/phone';
import { LeadPayloadSchema } from '@/lib/validators/lead.schema';

export async function POST(request: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Malformed JSON body' }, { status: 400 });
  }

  const parsed = LeadPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Invalid lead payload', issues: parsed.error.issues },
      { status: 422 },
    );
  }

  const lead = parsed.data;
  const { role, data } = resolveConfig(lead.role);

  const values: MessageField[] = [
    ['Name', lead.name],
    ['Phone', formatPhone(lead.phone)],
    ['Email', lead.email],
    ...Object.entries(lead.extras).map(([label, value]): MessageField => [label, value]),
  ];

  const waLink = buildWhatsAppLink({
    phone: data.contact.whatsapp,
    message: buildIntentMessage({
      intent: lead.intent,
      business: data.profile.name,
      values,
      note: lead.message,
    }),
    source: lead.source,
  });

  // Structured line so a log drain can pick leads up before the DB exists.
  console.info('[lead]', JSON.stringify({ role, intent: lead.intent, source: lead.source ?? null }));

  return NextResponse.json({ ok: true, waLink });
}
