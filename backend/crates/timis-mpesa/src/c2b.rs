use serde::Deserialize;

/// C2B registration and callback handling for paybill payments.
#[derive(Deserialize)]
pub struct C2BPayment {
    pub transaction_type: String,
    pub trans_id: String,
    pub trans_time: String,
    pub trans_amount: f64,
    pub business_short_code: String,
    pub bill_ref_number: String, // tenant account/invoice number
    pub msisdn: String,          // phone that paid
    pub first_name: Option<String>,
}

/// Matches a C2B payment to a tenant invoice by bill_ref_number (account number).
pub fn match_payment_to_invoice(payment: &C2BPayment) -> Option<String> {
    // bill_ref_number format: INV-{invoice_id_short} or UNIT-{unit_number}
    if payment.bill_ref_number.starts_with("INV-") || payment.bill_ref_number.starts_with("UNIT-") {
        Some(payment.bill_ref_number.clone())
    } else {
        None
    }
}
