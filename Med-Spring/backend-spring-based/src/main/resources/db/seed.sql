-- MediCore Production-Grade Seed Data Script
-- Safe & Idempotent Manual Execution Script

USE medicore;

-- Disable foreign key checks for clean truncation
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE consents;
TRUNCATE TABLE documents;
TRUNCATE TABLE medications;
TRUNCATE TABLE medical_records;
TRUNCATE TABLE patients;
TRUNCATE TABLE doctors;
TRUNCATE TABLE users;

SET FOREIGN_KEY_CHECKS = 1;

-- 1. USERS (Patient: vkannantech@gmail.com / Kannan@2006, Doctor: f@f.in / qwerty123)
INSERT INTO users (id, email, password, role, created_at, updated_at, username) VALUES
(1, 'vkannantech@gmail.com', '$2a$10$7oC9ig5w/l.0U4LyqaLQG.K3ID9gXmy6eftPSO6C1yxzd3/n7suOq', 'PATIENT', DATE_SUB(NOW(), INTERVAL 120 DAY), NOW(), NULL),
(2, 'f@f.in', '$2a$10$uYPu4vs97YBWScf5Z6NXWemw/CQ8Hmy3FEZT1UALPwo3/ka4BtEQu', 'DOCTOR', DATE_SUB(NOW(), INTERVAL 200 DAY), NOW(), NULL);

-- 2. PATIENT PROFILE
INSERT INTO patients (id, user_id, name, dob, gender, phone, emergency_contact, allergies, important_medical_notes) VALUES
(1, 1, 'Kannan V', '2006-03-15', 'MALE', '6374088373', 'V. Rajesh (Father) — 98400 12345', 'Penicillin', 'Mild exercise-induced asthma. Prefers evening consultations. No other chronic conditions.');

-- 3. DOCTOR PROFILE
INSERT INTO doctors (id, user_id, name, specialty, phone) VALUES
(1, 2, 'Dr. Aris Thorne', 'Cardiology', '044-28290000');

-- 4. MEDICAL RECORDS
INSERT INTO medical_records (id, patient_id, doctor_id, date, type, diagnosis, description, created_at) VALUES
(1, 1, 1, DATE_SUB(CURDATE(), INTERVAL 40 DAY), 'CONSULTATION', 'Cardiology Consultation — Palpitation Review', 'Benign sinus arrhythmia; no intervention required', DATE_SUB(NOW(), INTERVAL 40 DAY)),
(2, 1, 1, DATE_SUB(CURDATE(), INTERVAL 10 DAY), 'LAB_REPORT', 'Q3 Lipid Panel', 'Total cholesterol 172 mg/dL, LDL 96 mg/dL — within range', DATE_SUB(NOW(), INTERVAL 10 DAY)),
(3, 1, NULL, DATE_SUB(CURDATE(), INTERVAL 60 DAY), 'LAB_REPORT', 'HbA1c Screen', '5.4% — normal glycemic control', DATE_SUB(NOW(), INTERVAL 60 DAY)),
(4, 1, 1, DATE_SUB(CURDATE(), INTERVAL 30 DAY), 'PRESCRIPTION', 'Throat Infection Course', 'Azithromycin 500mg once daily for 5 days', DATE_SUB(NOW(), INTERVAL 30 DAY)),
(5, 1, NULL, DATE_SUB(CURDATE(), INTERVAL 90 DAY), 'MEDICAL_HISTORY', 'Annual Physical Examination', 'All vitals within normal limits; cleared for sports', DATE_SUB(NOW(), INTERVAL 90 DAY));

-- 5. MEDICATIONS
INSERT INTO medications (id, patient_id, name, dosage, frequency, start_date, end_date, instructions, follow_up_date, is_active, created_at) VALUES
(1, 1, 'Azithromycin 500mg', '1 tablet', 'Once daily after food', DATE_SUB(CURDATE(), INTERVAL 3 DAY), DATE_ADD(CURDATE(), INTERVAL 2 DAY), 'Complete the full 5-day course even if symptoms improve.', DATE_ADD(CURDATE(), INTERVAL 8 DAY), 1, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(2, 1, 'Vitamin D3 60K IU', '1 sachet', 'Once weekly with milk', DATE_SUB(CURDATE(), INTERVAL 30 DAY), DATE_ADD(CURDATE(), INTERVAL 60 DAY), 'Take after breakfast; review levels in 3 months.', DATE_ADD(CURDATE(), INTERVAL 20 DAY), 1, DATE_SUB(NOW(), INTERVAL 30 DAY)),
(3, 1, 'Paracetamol 650mg', '1 tablet', 'Twice daily as needed for fever', DATE_SUB(CURDATE(), INTERVAL 70 DAY), DATE_SUB(CURDATE(), INTERVAL 65 DAY), 'Discontinue once fever-free for 48 hours.', NULL, 0, DATE_SUB(NOW(), INTERVAL 70 DAY));

-- 6. DOCUMENTS
INSERT INTO documents (id, patient_id, name, type, upload_date, description, file_reference) VALUES
(1, 1, 'Lipid_Panel_Q3.pdf', 'LAB_REPORT', DATE_SUB(NOW(), INTERVAL 10 DAY), 'Fasting lipid profile — Apollo Diagnostics', 'uploads/lipid-panel-q3.pdf'),
(2, 1, 'ECG_Trace_July.pdf', 'IMAGING', DATE_SUB(NOW(), INTERVAL 40 DAY), '12-lead ECG trace from cardiology consult', 'uploads/ecg-july.pdf'),
(3, 1, 'Prescription_Throat_Infection.pdf', 'PRESCRIPTION', DATE_SUB(NOW(), INTERVAL 30 DAY), 'Azithromycin course prescription', 'uploads/rx-throat.pdf'),
(4, 1, 'Health_Insurance_Card.jpg', 'OTHER', DATE_SUB(NOW(), INTERVAL 120 DAY), 'Star Health policy card — front side', 'uploads/insurance-card.jpg');

-- 7. CONSENTS
INSERT INTO consents (id, patient_id, doctor_id, records_category, status, expiry_date, created_at) VALUES
(1, 1, 1, 'CONSULTATIONS, LAB_REPORTS, PRESCRIPTIONS', 'ACTIVE', DATE_ADD(NOW(), INTERVAL 45 DAY), DATE_SUB(NOW(), INTERVAL 20 DAY)),
(2, 1, 1, 'LAB_REPORTS', 'EXPIRED', DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 100 DAY)),
(3, 1, 1, 'DOCUMENTS', 'REVOKED', DATE_ADD(NOW(), INTERVAL 30 DAY), DATE_SUB(NOW(), INTERVAL 60 DAY));
