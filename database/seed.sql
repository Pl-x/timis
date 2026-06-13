-- TIMIS/TIMIS — Seed data for chart of accounts and initial config

-- Chart of Accounts (Kenya property management standard)
INSERT INTO chart_of_accounts (code, name, category) VALUES
-- Income
('4000', 'Income', 'income'),
('4100', 'Rental Income', 'income'),
('4200', 'Service Charge Income', 'income'),
('4300', 'Water Income', 'income'),
('4400', 'Electricity Income', 'income'),
('4500', 'Penalty Income', 'income'),
('4600', 'Other Income', 'income'),
-- Expenses
('5000', 'Expenses', 'expense'),
('5100', 'Maintenance & Repairs', 'expense'),
('5200', 'Water Expense', 'expense'),
('5300', 'Electricity Expense', 'expense'),
('5400', 'Security', 'expense'),
('5500', 'Cleaning', 'expense'),
('5600', 'Management Fee', 'expense'),
('5700', 'Insurance', 'expense'),
('5800', 'Land Rates & Rent', 'expense'),
('5900', 'Legal Fees', 'expense'),
-- Assets
('1000', 'Assets', 'asset'),
('1100', 'Bank - M-Pesa', 'asset'),
('1200', 'Bank - Equity', 'asset'),
('1300', 'Bank - KCB', 'asset'),
('1400', 'Accounts Receivable', 'asset'),
('1500', 'Tenant Deposits Held', 'asset'),
-- Liabilities
('2000', 'Liabilities', 'liability'),
('2100', 'Tenant Deposits Payable', 'liability'),
('2200', 'Landlord Payouts Payable', 'liability'),
('2300', 'VAT Payable', 'liability'),
('2400', 'Withholding Tax Payable', 'liability');

-- Update parent references
UPDATE chart_of_accounts SET parent_id = (SELECT id FROM chart_of_accounts WHERE code = '4000') WHERE code LIKE '41%' OR code LIKE '42%' OR code LIKE '43%' OR code LIKE '44%' OR code LIKE '45%' OR code LIKE '46%';
UPDATE chart_of_accounts SET parent_id = (SELECT id FROM chart_of_accounts WHERE code = '5000') WHERE code LIKE '51%' OR code LIKE '52%' OR code LIKE '53%' OR code LIKE '54%' OR code LIKE '55%' OR code LIKE '56%' OR code LIKE '57%' OR code LIKE '58%' OR code LIKE '59%';
UPDATE chart_of_accounts SET parent_id = (SELECT id FROM chart_of_accounts WHERE code = '1000') WHERE code LIKE '11%' OR code LIKE '12%' OR code LIKE '13%' OR code LIKE '14%' OR code LIKE '15%';
UPDATE chart_of_accounts SET parent_id = (SELECT id FROM chart_of_accounts WHERE code = '2000') WHERE code LIKE '21%' OR code LIKE '22%' OR code LIKE '23%' OR code LIKE '24%';
