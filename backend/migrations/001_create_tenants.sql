-- UP
CREATE TYPE tenant_status AS ENUM ('active', 'suspended', 'trial');
CREATE TYPE subscription_plan AS ENUM ('free', 'pro', 'enterprise');

CREATE TABLE tenants (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) NOT NULL UNIQUE,
    status tenant_status NOT NULL,
    subscription_plan subscription_plan NOT NULL,
    max_users INTEGER NOT NULL,
    max_projects INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DOWN
DROP TABLE IF EXISTS tenants;
DROP TYPE IF EXISTS tenant_status;
DROP TYPE IF EXISTS subscription_plan;
