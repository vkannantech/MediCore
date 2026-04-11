-- MediCore: Intelligent Hospital Management System
-- Run this script in MySQL before launching the application

CREATE DATABASE IF NOT EXISTS medicore;
USE medicore;

-- Users table (Authentication)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    patient_id INT UNIQUE NULL
);

-- Patient table
CREATE TABLE IF NOT EXISTS patient (
    patient_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT,
    gender VARCHAR(10),
    phone VARCHAR(15)
);

-- Doctor table
CREATE TABLE IF NOT EXISTS doctor (
    doctor_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100),
    availability VARCHAR(50)
);

-- Appointment table
CREATE TABLE IF NOT EXISTS appointment (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    doctor_id INT,
    date DATE,
    status VARCHAR(50),
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_id)
);
CREATE INDEX idx_appointment_patient ON appointment(patient_id);
CREATE INDEX idx_appointment_doctor ON appointment(doctor_id);
CREATE INDEX idx_appointment_date ON appointment(date);

-- Medical Record table
CREATE TABLE IF NOT EXISTS medical_record (
    record_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    diagnosis TEXT,
    prescription TEXT,
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id)
);
CREATE INDEX idx_medical_record_patient ON medical_record(patient_id);

-- Billing table
CREATE TABLE IF NOT EXISTS billing (
    bill_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    amount DOUBLE,
    date DATE,
    payment_status VARCHAR(20) DEFAULT 'Unpaid',
    payment_method VARCHAR(30) DEFAULT 'Cash',
    notes TEXT,
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id)
);
CREATE INDEX idx_billing_patient ON billing(patient_id);
CREATE INDEX idx_billing_date ON billing(date);

-- Patient Test / Lab Reports
CREATE TABLE IF NOT EXISTS patient_report (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    report_type VARCHAR(50) NOT NULL,
    report_name VARCHAR(150) NOT NULL,
    report_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending',
    result_summary TEXT,
    attachment_path VARCHAR(255),
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id)
);
CREATE INDEX idx_patient_report_patient ON patient_report(patient_id);
CREATE INDEX idx_patient_report_date ON patient_report(report_date);

CREATE INDEX idx_patient_name ON patient(name);
CREATE INDEX idx_patient_phone ON patient(phone);
CREATE INDEX idx_doctor_specialization ON doctor(specialization);

-- Test Data
INSERT IGNORE INTO users (username, password, role) VALUES ('admin', '1234', 'ADMIN');
INSERT IGNORE INTO users (username, password, role) VALUES ('staff', 'staff123', 'USER');

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'USER';

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS patient_id INT UNIQUE NULL;

UPDATE users SET role = 'ADMIN' WHERE username = 'admin';
UPDATE users SET role = 'USER' WHERE username <> 'admin' AND (role IS NULL OR role = '');

INSERT INTO doctor (name, specialization, availability) VALUES
('Dr. Ravi Kumar',  'General',        'Morning'),
('Dr. Priya Nair',  'Cardiologist',   'Evening'),
('Dr. Arun Mehta',  'Orthopedic',     'Morning'),
('Dr. Sunita Rao',  'Pediatrician',   'Afternoon'),
('Dr. Karan Shah',  'Dermatologist',  'Evening'),
('Dr. Meena Pillai','Ophthalmologist','Morning');

INSERT INTO patient (name, age, gender, phone) VALUES
('Kannan V',  20, 'Male',   '9876543210'),
('Priya S',   35, 'Female', '9123456789'),
('Raju M',    55, 'Male',   '9988776655');

INSERT INTO patient_report (patient_id, report_type, report_name, report_date, status, result_summary, attachment_path) VALUES
(1, 'Blood Test', 'CBC + Sugar Test', CURDATE(), 'Reviewed', 'Hemoglobin normal. Fasting sugar slightly elevated.', 'D:\\Reports\\cbc-kannan.pdf'),
(2, 'X-Ray', 'Chest X-Ray', CURDATE(), 'Received', 'Mild congestion visible. Follow-up recommended.', 'D:\\Reports\\priya-chest-xray.jpg');
