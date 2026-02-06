import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

// E-Mail-Benachrichtigung senden (asynchron)
async function sendEmailNotification(contactData: any) {
  try {
    const recipientEmail = process.env.NOTIFICATION_EMAIL || 'info@muckenfussundnagel.de';
    const emailSubject = `🆕 Neuer Lead: ${contactData.first_name} ${contactData.last_name}`;
    
    // E-Mail-Inhalt erstellen
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
              
              ${contactData.quiz_data ? `
              <div class="quiz-data">
                <h3>📋 Quiz-Daten</h3>
                ${formatQuizData(contactData.quiz_data)}
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

    // Option 1: Resend (empfohlen)
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
        console.log('✅ E-Mail-Benachrichtigung per Resend gesendet');
        return;
      }
    }

    // Option 2: SendGrid
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
        console.log('✅ E-Mail-Benachrichtigung per SendGrid gesendet');
        return;
      }
    }

    // Fallback: Loggen
    console.log('📧 E-Mail-Benachrichtigung (kein E-Mail-Service konfiguriert):');
    console.log('Empfänger:', recipientEmail);
    console.log('Betreff:', emailSubject);
    
  } catch (error) {
    console.error('Fehler beim Senden der E-Mail:', error);
    // Fehler wird nicht weitergegeben, damit die Kontaktanfrage trotzdem gespeichert wird
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validierung
    if (!body.firstName || !body.lastName || !body.email) {
      return NextResponse.json(
        { error: 'Bitte füllen Sie alle Pflichtfelder aus.' },
        { status: 400 }
      );
    }

    // Email-Validierung
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' },
        { status: 400 }
      );
    }

    // Daten in Supabase speichern (falls konfiguriert)
    if (supabase) {
      const { data, error } = await supabase
        .from('contact_submissions')
        .insert([
          {
            first_name: body.firstName,
            last_name: body.lastName,
            email: body.email,
            phone: body.phone || null,
            service: body.service || null,
            message: body.message || null,
            street: body.street || null,
            city: body.city || null,
            company: body.company || null,
            quiz_data: body.quizData || null,
            status: 'neu',
            source: 'website_form',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) {
        console.error('Supabase Fehler:', error);
        // Fallback: Daten trotzdem loggen
        console.log('Neue Kontaktanfrage (Fallback):', {
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
          phone: body.phone || 'Nicht angegeben',
          service: body.service || 'Nicht angegeben',
          message: body.message || 'Keine Nachricht',
          quizData: body.quizData || null,
          timestamp: new Date().toISOString(),
        });
      } else {
        console.log('Kontaktanfrage erfolgreich in Supabase gespeichert:', data);
        
        // E-Mail-Benachrichtigung senden (asynchron, blockiert nicht die Antwort)
        if (data && data[0]) {
          // Asynchron senden, blockiert nicht die Antwort
          sendEmailNotification(data[0]).catch(err => {
            console.error('Fehler beim Senden der E-Mail-Benachrichtigung:', err);
            // Fehler wird nicht an den Client weitergegeben
          });
        }
      }
    } else {
      // Fallback: Daten loggen, falls Supabase nicht konfiguriert ist
      console.log('Neue Kontaktanfrage (Supabase nicht konfiguriert):', {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone || 'Nicht angegeben',
        service: body.service || 'Nicht angegeben',
        message: body.message || 'Keine Nachricht',
        quizData: body.quizData || null,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'Ihre Nachricht wurde erfolgreich versendet. Wir melden uns schnellstmöglich bei Ihnen.'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fehler beim Verarbeiten der Kontaktanfrage:', error);
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.' },
      { status: 500 }
    );
  }
}

