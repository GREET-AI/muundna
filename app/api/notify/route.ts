import { NextRequest, NextResponse } from 'next/server';

// E-Mail-Benachrichtigung bei neuen Leads
// Kostenfreie Optionen:
// 1. Resend (empfohlen): 3000 E-Mails/Monat kostenfrei
// 2. SendGrid: 100 E-Mails/Tag kostenfrei
// 3. Nodemailer mit Gmail SMTP: kostenfrei, aber limitiert

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contactData, type = 'new_lead' } = body;

    // E-Mail-Empfänger (kann aus .env.local kommen)
    const recipientEmail = process.env.NOTIFICATION_EMAIL || 'info@muckenfussundnagel.de';

    // E-Mail-Inhalt erstellen
    const emailSubject = type === 'new_lead' 
      ? `🆕 Neuer Lead: ${contactData.first_name} ${contactData.last_name}`
      : `📧 Neue Kontaktanfrage: ${contactData.first_name} ${contactData.last_name}`;

    const emailBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #182c30; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
            .info-row { margin: 10px 0; padding: 10px; background: white; border-radius: 4px; }
            .label { font-weight: bold; color: #cb530a; }
            .quiz-data { background: #fef3ed; padding: 15px; border-radius: 4px; margin: 10px 0; border-left: 4px solid #cb530a; }
            .button { display: inline-block; padding: 12px 24px; background: #cb530a; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🆕 Neuer Lead erhalten</h1>
              <p>Muckenfuss & Nagel CRM</p>
            </div>
            <div class="content">
              <h2>Kontaktinformationen</h2>
              
              <div class="info-row">
                <span class="label">Name:</span> ${contactData.first_name} ${contactData.last_name}
              </div>
              
              <div class="info-row">
                <span class="label">E-Mail:</span> <a href="mailto:${contactData.email}">${contactData.email}</a>
              </div>
              
              ${contactData.phone ? `
              <div class="info-row">
                <span class="label">Telefon:</span> <a href="tel:${contactData.phone}">${contactData.phone}</a>
              </div>
              ` : ''}
              
              ${contactData.street || contactData.city ? `
              <div class="info-row">
                <span class="label">Adresse:</span> ${contactData.street || ''} ${contactData.city || ''}
              </div>
              ` : ''}
              
              ${contactData.service ? `
              <div class="info-row">
                <span class="label">Dienstleistung:</span> ${contactData.service}
              </div>
              ` : ''}
              
              ${contactData.message ? `
              <div class="info-row">
                <span class="label">Nachricht:</span><br>
                ${contactData.message}
              </div>
              ` : ''}
              
              ${contactData.quizData ? `
              <div class="quiz-data">
                <h3>📋 Quiz-Daten</h3>
                ${formatQuizData(contactData.quizData)}
              </div>
              ` : ''}
              
              <div class="info-row">
                <span class="label">Eingegangen am:</span> ${new Date(contactData.created_at || new Date()).toLocaleString('de-DE')}
              </div>
              
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://muckenfussundnagel.de'}/admin" class="button">
                Zum CRM öffnen
              </a>
            </div>
          </div>
        </body>
      </html>
    `;

    // Option 1: Resend (empfohlen - kostenfrei bis 3000/Monat)
    if (process.env.RESEND_API_KEY) {
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || 'noreply@muckenfussundnagel.de',
          to: recipientEmail,
          subject: emailSubject,
          html: emailBody,
        }),
      });

      if (resendResponse.ok) {
        return NextResponse.json({ success: true, provider: 'resend' });
      }
    }

    // Option 2: SendGrid (kostenfrei bis 100/Tag)
    if (process.env.SENDGRID_API_KEY) {
      const sendGridResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: recipientEmail }],
            subject: emailSubject,
          }],
          from: { email: process.env.SENDGRID_FROM_EMAIL || 'noreply@muckenfussundnagel.de' },
          content: [{
            type: 'text/html',
            value: emailBody,
          }],
        }),
      });

      if (sendGridResponse.ok) {
        return NextResponse.json({ success: true, provider: 'sendgrid' });
      }
    }

    // Fallback: Loggen (für Entwicklung)
    console.log('📧 E-Mail-Benachrichtigung (kein E-Mail-Service konfiguriert):');
    console.log('Empfänger:', recipientEmail);
    console.log('Betreff:', emailSubject);
    console.log('Daten:', contactData);

    return NextResponse.json({ 
      success: true, 
      provider: 'console',
      message: 'E-Mail wurde geloggt (kein E-Mail-Service konfiguriert)' 
    });

  } catch (error) {
    console.error('Fehler beim Senden der E-Mail:', error);
    return NextResponse.json(
      { error: 'Fehler beim Senden der E-Mail-Benachrichtigung' },
      { status: 500 }
    );
  }
}

function formatQuizData(quizData: any): string {
  if (!quizData || typeof quizData !== 'object') return '';
  
  let html = '<ul style="list-style: none; padding: 0;">';
  
  if (quizData.targetGroup && Array.isArray(quizData.targetGroup)) {
    html += '<li><strong>Zielgruppe:</strong> ' + quizData.targetGroup.join(', ') + '</li>';
  }
  
  if (quizData.services && Array.isArray(quizData.services)) {
    html += '<li><strong>Dienstleistungen:</strong> ' + quizData.services.join(', ') + '</li>';
  }
  
  if (quizData.timeframe && Array.isArray(quizData.timeframe)) {
    html += '<li><strong>Zeitrahmen:</strong> ' + quizData.timeframe.join(', ') + '</li>';
  }
  
  if (quizData.location) {
    html += '<li><strong>Beratung:</strong> ' + quizData.location + '</li>';
  }
  
  html += '</ul>';
  return html;
}

