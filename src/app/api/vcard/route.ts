/**
 * Server-rendered .vcf. Exists because iOS Safari will not honour a blob
 * download for `text/vcard` — see src/core/vcard/download.ts.
 */
import { NextResponse } from 'next/server';
import { resolveConfig } from '@/config';
import { isRoleKey } from '@/types/role';
import { buildVCard, VCARD_MIME } from '@/core/vcard/build-vcard';

export async function GET(request: Request): Promise<NextResponse> {
  const roleParam = new URL(request.url).searchParams.get('role');
  const role = roleParam && isRoleKey(roleParam) ? roleParam : undefined;

  const { preset, data } = resolveConfig(role);
  const origin = new URL(request.url).origin;
  const { content, filename } = buildVCard({
    profile: data.profile,
    contact: data.contact,
    preset,
    baseUrl: process.env.NEXT_PUBLIC_SITE_URL ?? origin,
  });

  return new NextResponse(content, {
    headers: {
      'Content-Type': VCARD_MIME,
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  });
}
