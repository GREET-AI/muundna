# Placetel-Anbindung im CRM

Im Admin gibt es überall dort, wo eine Telefonnummer angezeigt wird, einen **„Anrufen“-Button**. So können Vertriebler Leads direkt aus dem CRM anrufen.

## Aktuell: Anrufen per `tel:`-Link

- **Tabelle:** In der Spalte „Telefon“ steht neben der Nummer ein grüner Button **„Anrufen“**.
- **Pipeline/Karten:** Unter der Telefonzeile erscheint ein Button **„Anrufen“**.

Ein Klick öffnet den Anruf mit der **Standard-Telefonanwendung** des Geräts:

- **Desktop:** z. B. Placetel/Webex Softphone, wenn es als Standard für Anrufe eingestellt ist, oder ein anderes SIP-Programm.
- **Handy/Tablet:** Die normale Telefon-App oder die Placetel/Webex-App, wenn sie für `tel:`-Links zuständig ist.

**Placetel nutzen:**  
Placetel/Webex als Standard-Anwendung für Telefonanrufe einrichten (Systemeinstellungen bzw. in der Placetel/Webex-App), dann startet ein Klick auf „Anrufen“ den Anruf über Placetel.

## Optional: Placetel/Webex Call-Control-API (Click-to-Call aus dem Browser)

Placetel nutzt die **Webex Call Control API**. Damit ließe sich ein echter **Click-to-Call aus dem Browser** bauen (ohne `tel:`-Link):

1. **OAuth:** App bei [Placetel Developers / Webex](https://www.placetel.de/developers) anlegen, Client-ID und Secret holen.
2. **Backend:** Route (z. B. `/api/placetel/call`) die mit dem Webex Call-Control-API einen Anruf auslöst („from“ = eingeloggter Nutzer, „to“ = Lead-Nummer).
3. **Frontend:** „Anrufen“-Button ruft diese API auf statt eines `tel:`-Links.

Dokumentation: [Placetel API](https://www.placetel.de/funktionen/api), [Webex für Placetel](https://www.placetel.de/funktionen/api) (Call Control, OAuth).  
Wenn du diese API-Integration möchtest, können wir sie als nächsten Schritt einplanen (OAuth-Flow, Env-Variablen, UI-Anpassung).
