/// Reconciliation logic: matches M-Pesa transactions to invoices,
/// handles partial payments, overpayments, and unmatched transactions.

pub enum ReconcileResult {
    FullyPaid { invoice_id: String },
    PartialPayment { invoice_id: String, remaining: f64 },
    Overpayment { invoice_id: String, excess: f64 },
    Unmatched { mpesa_ref: String, amount: f64 },
}

pub fn reconcile_payment(mpesa_amount: f64, invoice_balance: f64, invoice_id: &str, mpesa_ref: &str) -> ReconcileResult {
    if mpesa_amount >= invoice_balance {
        if mpesa_amount > invoice_balance {
            ReconcileResult::Overpayment { invoice_id: invoice_id.into(), excess: mpesa_amount - invoice_balance }
        } else {
            ReconcileResult::FullyPaid { invoice_id: invoice_id.into() }
        }
    } else {
        ReconcileResult::PartialPayment { invoice_id: invoice_id.into(), remaining: invoice_balance - mpesa_amount }
    }
}
