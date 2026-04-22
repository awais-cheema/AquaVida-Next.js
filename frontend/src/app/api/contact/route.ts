import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = 'info@aquavidapoolsandspas.com';

export async function POST(request: NextRequest) {
    const body = await request.json().catch(() => null);
    if (!body) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

    const { fullName, phone, email, address, service, budget, consultation, comments } = body;

    if (!fullName || !phone || !email || !address || !service) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background:#0d1117;padding:32px 40px;text-align:center;">
            <p style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:0.04em;">AquaVida Pools and Spas</p>
            <p style="margin:8px 0 0;color:#6b7280;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;">New Contact Form Submission</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              ${row('Full Name', fullName)}
              ${row('Phone', phone)}
              ${row('Email', email, `<a href="mailto:${email}" style="color:#2563eb;">${email}</a>`)}
              ${row('Address', address)}
              ${row('Service', service)}
              ${budget  ? row('Budget', budget) : ''}
              ${consultation ? row('FOC Consultation', consultation) : ''}
              ${comments ? row('Comments', comments) : ''}
            </table>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
            <p style="margin:0;color:#9ca3af;font-size:12px;">This email was sent from the contact form at aquavidapoolsandspas.com</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    try {
        const { error } = await resend.emails.send({
            from:     'AquaVida Contact Form <onboarding@resend.dev>',
            to:       TO_EMAIL,
            replyTo:  email,
            subject:  `New Enquiry from ${fullName} — ${service}`,
            html,
        });

        if (error) {
            console.error('Resend error:', error);
            return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
        }

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('Contact route error:', err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

function row(label: string, value: string, html?: string): string {
    return `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;vertical-align:top;width:36%;">
          <span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#6b7280;">${label}</span>
        </td>
        <td style="padding:10px 0 10px 16px;border-bottom:1px solid #f3f4f6;vertical-align:top;">
          <span style="font-size:15px;color:#111827;">${html ?? value}</span>
        </td>
      </tr>`;
}
