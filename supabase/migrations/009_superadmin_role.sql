-- Rolle "superadmin": Vollzugriff inkl. Digitale Produkte.
-- Rolle "admin": wie bisher, aber ohne Zugriff auf Digitale Produkte (nur in der App ausgeblendet).
-- User "admin" wird auf superadmin gesetzt; pascal und sven bleiben auf admin.

INSERT INTO roles (name, description, permissions)
VALUES ('superadmin', 'Vollzugriff inkl. Digitale Produkte', '["admin"]'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- Nur den Benutzer mit Benutzername "admin" auf superadmin setzen (Default-Tenant)
UPDATE users
SET role_id = (SELECT id FROM roles WHERE name = 'superadmin' LIMIT 1)
WHERE username = 'admin'
  AND tenant_id = (SELECT id FROM tenants WHERE slug = 'muckenfuss-nagel' LIMIT 1);
