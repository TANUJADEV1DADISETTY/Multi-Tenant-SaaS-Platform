-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================
-- 1. INSERT TENANT
-- =========================
INSERT INTO tenants (
    id,
    name,
    subdomain,
    status,
    subscription_plan,
    max_users,
    max_projects,
    created_at,
    updated_at
) VALUES (
    uuid_generate_v4(),
    'Demo Company',
    'demo',
    'active',
    'pro',
    25,
    15,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- =========================
-- 2. INSERT SUPER ADMIN
-- =========================
INSERT INTO users (
    id,
    tenant_id,
    email,
    password_hash,
    full_name,
    role,
    is_active,
    created_at,
    updated_at
) VALUES (
    uuid_generate_v4(),
    NULL,
    'superadmin@system.com',
    '$2b$10$Q9y7ZySUdkGFUTkOcJCIZe9FHn5Vf3L7hIwrKyYVJZZzKzbwQ6vur', -- Admin@123
    'System Super Admin',
    'super_admin',
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- =========================
-- 3. INSERT TENANT ADMIN
-- =========================
INSERT INTO users (
    id,
    tenant_id,
    email,
    password_hash,
    full_name,
    role,
    is_active,
    created_at,
    updated_at
)
SELECT
    uuid_generate_v4(),
    t.id,
    'admin@demo.com',
    '$2b$10$5vW7x1YgnSUZXoqBYwygGOBWzPp2rU9jwELyhl725LLJoPLD114F2', -- Demo@123
    'Demo Tenant Admin',
    'tenant_admin',
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM tenants t
WHERE t.subdomain = 'demo';

-- =========================
-- 4. INSERT REGULAR USERS
-- =========================
INSERT INTO users (
    id,
    tenant_id,
    email,
    password_hash,
    full_name,
    role,
    is_active,
    created_at,
    updated_at
)
SELECT
    uuid_generate_v4(),
    t.id,
    'user1@demo.com',
    '$2b$10$5vW7x1YgnSUZXoqBYwygGOBWzPp2rU9jwELyhl725LLJoPLD114F2', -- User@123
    'Demo User One',
    'user',
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM tenants t
WHERE t.subdomain = 'demo';

INSERT INTO users (
    id,
    tenant_id,
    email,
    password_hash,
    full_name,
    role,
    is_active,
    created_at,
    updated_at
)
SELECT
    uuid_generate_v4(),
    t.id,
    'user2@demo.com',
    '$2b$10$5vW7x1YgnSUZXoqBYwygGOBWzPp2rU9jwELyhl725LLJoPLD114F2', -- User@123
    'Demo User Two',
    'user',
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM tenants t
WHERE t.subdomain = 'demo';

-- =========================
-- 5. INSERT PROJECTS
-- =========================
INSERT INTO projects (
    id,
    tenant_id,
    name,
    description,
    status,
    created_by,
    created_at,
    updated_at
)
SELECT
    uuid_generate_v4(),
    t.id,
    'Project Alpha',
    'First demo project',
    'active',
    u.id,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM tenants t, users u
WHERE t.subdomain = 'demo'
  AND u.email = 'admin@demo.com';

INSERT INTO projects (
    id,
    tenant_id,
    name,
    description,
    status,
    created_by,
    created_at,
    updated_at
)
SELECT
    uuid_generate_v4(),
    t.id,
    'Project Beta',
    'Second demo project',
    'active',
    u.id,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM tenants t, users u
WHERE t.subdomain = 'demo'
  AND u.email = 'admin@demo.com';

-- =========================
-- 6. INSERT TASKS
-- =========================
INSERT INTO tasks (
    id,
    project_id,
    tenant_id,
    title,
    description,
    status,
    priority,
    assigned_to,
    due_date,
    created_at,
    updated_at
)
SELECT
    uuid_generate_v4(),
    p.id,
    p.tenant_id,
    'Design Homepage',
    'Create homepage design',
    'todo',
    'high',
    u.id,
    CURRENT_DATE + INTERVAL '7 days',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM projects p, users u
WHERE p.name = 'Project Alpha'
  AND u.email = 'user1@demo.com';

INSERT INTO tasks (
    id,
    project_id,
    tenant_id,
    title,
    description,
    status,
    priority,
    assigned_to,
    due_date,
    created_at,
    updated_at
)
SELECT
    uuid_generate_v4(),
    p.id,
    p.tenant_id,
    'Build Backend API',
    'Develop API endpoints',
    'in_progress',
    'medium',
    u.id,
    CURRENT_DATE + INTERVAL '10 days',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM projects p, users u
WHERE p.name = 'Project Alpha'
  AND u.email = 'user2@demo.com';

INSERT INTO tasks (
    id,
    project_id,
    tenant_id,
    title,
    description,
    status,
    priority,
    assigned_to,
    due_date,
    created_at,
    updated_at
)
SELECT
    uuid_generate_v4(),
    p.id,
    p.tenant_id,
    'Prepare UI Mockups',
    'Create UI wireframes',
    'todo',
    'low',
    u.id,
    CURRENT_DATE + INTERVAL '5 days',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM projects p, users u
WHERE p.name = 'Project Beta'
  AND u.email = 'user1@demo.com';
