import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

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
            quiz_data: body.quizData || null,
            created_at: new Date().toISOString(),
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

