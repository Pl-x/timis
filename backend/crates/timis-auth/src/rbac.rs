use timis_core::types::UserRole;

/// Checks if a role has permission for a given action on a resource.
pub fn check_permission(role: &UserRole, resource: &str, action: &str) -> bool {
    match role {
        UserRole::SuperAdmin => true,
        UserRole::LandlordAdmin => !matches!(resource, "platform_billing" | "org_management"),
        UserRole::PropertyManager => matches!(resource,
            "tenants" | "units" | "leases" | "payments" | "maintenance" | "disputes" | "communications" | "reports"
        ),
        UserRole::Accountant => matches!(resource, "payments" | "invoices" | "reports" | "payouts"),
        UserRole::Tenant => {
            matches!((resource, action),
                ("payments", "read") | ("payments", "create") |
                ("maintenance", "read") | ("maintenance", "create") |
                ("disputes", "read") | ("disputes", "create") |
                ("score", "read") | ("communications", _) |
                ("leases", "read") | ("profile", _)
            )
        }
        UserRole::Maintenance => matches!(resource, "maintenance" | "vendors"),
    }
}
