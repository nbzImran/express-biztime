// seed.sql - Populate tables for testing

-- Drop tables if they exist
drop table if exists invoices;
drop table if exists companies;

-- Create companies table
CREATE TABLE companies (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT
);

-- Create invoices table
CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  comp_code TEXT NOT NULL REFERENCES companies ON DELETE CASCADE,
  amt FLOAT NOT NULL,
  paid BOOLEAN DEFAULT false,
  add_date DATE DEFAULT CURRENT_DATE,
  paid_date DATE
);

-- Insert sample companies
INSERT INTO companies (code, name, description) VALUES
  ('apple', 'Apple Inc.', 'Technology Company'),
  ('ibm', 'IBM Corporation', 'Technology and Consulting'),
  ('microsoft', 'Microsoft Corp.', 'Software and Technology');

-- Insert sample invoices
INSERT INTO invoices (comp_code, amt, paid, paid_date) VALUES
  ('apple', 500, false, NULL),
  ('ibm', 300, true, '2023-06-15'),
  ('microsoft', 450, false, NULL);

-- Verify data
SELECT * FROM companies;
SELECT * FROM invoices;
