import pool from "../config/db.js";

/**
 * API 5: Get Tenant Details
 */
export const getTenant = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const user = req.user;

    // Authorization
    if (user.role !== "super_admin" && user.tenantId !== tenantId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden"
      });
    }

    const tenantResult = await pool.query(
      `SELECT id, name, subdomain, status, subscription_plan,
              max_users, max_projects, created_at
       FROM tenants
       WHERE id = $1`,
      [tenantId]
    );

    if (tenantResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found"
      });
    }

    const usersCount = await pool.query(
      "SELECT COUNT(*) FROM users WHERE tenant_id = $1",
      [tenantId]
    );

    const projectsCount = await pool.query(
      "SELECT COUNT(*) FROM projects WHERE tenant_id = $1",
      [tenantId]
    );

    const tasksCount = await pool.query(
      "SELECT COUNT(*) FROM tasks WHERE tenant_id = $1",
      [tenantId]
    );

    const tenant = tenantResult.rows[0];

    res.status(200).json({
      success: true,
      data: {
        id: tenant.id,
        name: tenant.name,
        subdomain: tenant.subdomain,
        status: tenant.status,
        subscriptionPlan: tenant.subscription_plan,
        maxUsers: tenant.max_users,
        maxProjects: tenant.max_projects,
        createdAt: tenant.created_at,
        stats: {
          totalUsers: Number(usersCount.rows[0].count),
          totalProjects: Number(projectsCount.rows[0].count),
          totalTasks: Number(tasksCount.rows[0].count)
        }
      }
    });
  } catch (error) {
    console.error("Get Tenant Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/**
 * API 6: Update Tenant
 */
export const updateTenant = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { name } = req.body;
    const user = req.user;

    if (user.role !== "super_admin" && user.role !== "tenant_admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden"
      });
    }

    if (user.role === "tenant_admin" && user.tenantId !== tenantId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden"
      });
    }

    const result = await pool.query(
      "UPDATE tenants SET name = $1, updated_at = NOW() WHERE id = $2 RETURNING id, name",
      [name, tenantId]
    );

    res.status(200).json({
      success: true,
      message: "Tenant updated successfully",
      data: result.rows[0]
    });
  } catch (error) {
    console.error("Update Tenant Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/**
 * API 7: List All Tenants (Super Admin)
 */
export const listTenants = async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden"
      });
    }

    const result = await pool.query(
      `SELECT id, name, subdomain, status, subscription_plan, created_at
       FROM tenants
       ORDER BY created_at DESC`
    );

    res.status(200).json({
      success: true,
      data: {
        tenants: result.rows
      }
    });
  } catch (error) {
    console.error("List Tenants Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
