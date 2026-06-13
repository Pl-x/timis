use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum UserRole {
    SuperAdmin,
    LandlordAdmin,
    PropertyManager,
    Tenant,
    Maintenance,
    Accountant,
}

impl UserRole {
    pub fn from_str(s: &str) -> Option<Self> {
        match s {
            "super_admin" => Some(Self::SuperAdmin),
            "landlord_admin" => Some(Self::LandlordAdmin),
            "property_manager" => Some(Self::PropertyManager),
            "tenant" => Some(Self::Tenant),
            "maintenance" => Some(Self::Maintenance),
            "accountant" => Some(Self::Accountant),
            _ => None,
        }
    }
}
