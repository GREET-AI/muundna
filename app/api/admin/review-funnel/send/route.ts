import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { isAdminAuthenticated } from '@/lib/admin-auth';

type Recipient = { name?: string; email: string; kunde?: string; googleLink?: string };
type Template = { kunde: string; googleLink: string; messageBody: string };

function fillTemplate(body: string, name: string, kunde: string, link: string): string {
  return body
    .replace(/\{\{name\}\}/g, name)
    .replace(/\{\{kunde\}\}/g, kunde)
    .replace(/\{\{link\}\}/g, link);
}

export async function POST(request: NextRequest) {
  try {
    const cookie = request.cookies.get('admin_session')?.value;
    if (!isAdminAuthenticated(cookie)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || process.env.FROM_EMAIL || 'onboarding@resend.dev';
    if (!apiKey) {
      return NextResponse.json(
        { error: 'RESEND_API_KEY nicht gesetzt. Bitte in .env.local eintragen.' },
        { status: 500 }
      );
    }

    let body: { recipients?: Recipient[]; template?: Template };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Ungültige Anfrage (JSON).' }, { status: 400 });
    }
    const recipients: Recipient[] = Array.isArray(body.recipients) ? body.recipients : [];
    const template: Template = body.template ?? {
      kunde: '',
      googleLink: '',
      messageBody: 'Hallo {{name}},\n\n{{kunde}} würde sich sehr über eine Google-Bewertung freuen:\n{{link}}\n\nVielen Dank!',
    };

    const withEmail = recipients.filter((r) => (r.email || '').trim());
    if (withEmail.length === 0) {
      return NextResponse.json(
        { error: 'Keine Empfänger mit E-Mail.' },
        { status: 400 }
      );
    }

    const resend = new Resend(apiKey);
    const kunde = (template.kunde || '').trim() || 'Unser Kunde';
    let sent = 0;

    for (const r of withEmail) {
      const email = (r.email || '').trim();
      const name = (r.name || '').trim() || 'Sie';
      const link = (r.googleLink || template.googleLink || '').trim() || '(Bitte Link ergänzen)';
      const recipientKunde = (r.kunde || '').trim() || kunde;
      const text = fillTemplate(template.messageBody, name, recipientKunde, link);
      const html = text.replace(/\n/g, '<br>\n');

      const { error } = await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: `${recipientKunde} bittet um Ihre Google-Bewertung`,
        html,
        text,
      });
      if (!error) sent++;
    }

    return NextResponse.json({ ok: true, sent });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Fehler beim E-Mail-Versand';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
