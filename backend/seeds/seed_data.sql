INSERT INTO users (email, password_hash, role)
VALUES ('superadmin@system.com', '$2b$10$hash', 'super_admin')
ON CONFLICT DO NOTHING;
