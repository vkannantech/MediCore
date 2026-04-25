-- MediCore: Intelligent Hospital Management System
-- Run this script in MySQL before launching the application

CREATE DATABASE IF NOT EXISTS medicore;
USE medicore;

DROP PROCEDURE IF EXISTS create_index_if_missing;
DROP PROCEDURE IF EXISTS add_column_if_missing;
DELIMITER //
CREATE PROCEDURE add_column_if_missing(
    IN table_name_value VARCHAR(64),
    IN column_name_value VARCHAR(64),
    IN column_definition_value VARCHAR(255)
)
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = DATABASE()
          AND table_name = table_name_value
          AND column_name = column_name_value
    ) THEN
        SET @add_column_sql = CONCAT('ALTER TABLE ', table_name_value, ' ADD COLUMN ', column_name_value, ' ', column_definition_value);
        PREPARE add_column_stmt FROM @add_column_sql;
        EXECUTE add_column_stmt;
        DEALLOCATE PREPARE add_column_stmt;
    END IF;
END//

CREATE PROCEDURE create_index_if_missing(
    IN table_name_value VARCHAR(64),
    IN index_name_value VARCHAR(64),
    IN columns_value VARCHAR(255)
)
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.statistics
        WHERE table_schema = DATABASE()
          AND table_name = table_name_value
          AND index_name = index_name_value
    ) THEN
        SET @create_index_sql = CONCAT('CREATE INDEX ', index_name_value, ' ON ', table_name_value, '(', columns_value, ')');
        PREPARE create_index_stmt FROM @create_index_sql;
        EXECUTE create_index_stmt;
        DEALLOCATE PREPARE create_index_stmt;
    END IF;
END//
DELIMITER ;

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
CALL create_index_if_missing('appointment', 'idx_appointment_patient', 'patient_id');
CALL create_index_if_missing('appointment', 'idx_appointment_doctor', 'doctor_id');
CALL create_index_if_missing('appointment', 'idx_appointment_date', 'date');

-- Medical Record table
CREATE TABLE IF NOT EXISTS medical_record (
    record_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    diagnosis TEXT,
    prescription TEXT,
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id)
);
CALL create_index_if_missing('medical_record', 'idx_medical_record_patient', 'patient_id');

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
CALL create_index_if_missing('billing', 'idx_billing_patient', 'patient_id');
CALL create_index_if_missing('billing', 'idx_billing_date', 'date');

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
CALL create_index_if_missing('patient_report', 'idx_patient_report_patient', 'patient_id');
CALL create_index_if_missing('patient_report', 'idx_patient_report_date', 'report_date');

CALL create_index_if_missing('patient', 'idx_patient_name', 'name');
CALL create_index_if_missing('patient', 'idx_patient_phone', 'phone');
CALL create_index_if_missing('doctor', 'idx_doctor_specialization', 'specialization');

CALL add_column_if_missing('users', 'role', 'VARCHAR(20) NOT NULL DEFAULT ''USER''');
CALL add_column_if_missing('users', 'patient_id', 'INT UNIQUE NULL');

UPDATE users SET role = 'ADMIN' WHERE username = 'admin';
UPDATE users SET role = 'USER' WHERE username <> 'admin' AND (role IS NULL OR role = '');

-- Seed / sync data aligned with the Next.js app.
-- Passwords are bcrypt hashes because the app never authenticates plain text in production.
-- Admin: admin / 1234
-- Patient users: username / Medi@username

INSERT INTO patient (name, age, gender, phone)
SELECT 'Kannan V', 20, 'Male', '9876543210'
WHERE NOT EXISTS (SELECT 1 FROM patient WHERE name = 'Kannan V' AND phone = '9876543210');

INSERT INTO patient (name, age, gender, phone)
SELECT 'Priya S', 35, 'Female', '9123456789'
WHERE NOT EXISTS (SELECT 1 FROM patient WHERE name = 'Priya S' AND phone = '9123456789');

INSERT INTO patient (name, age, gender, phone)
SELECT 'Raju M', 55, 'Male', '9988776655'
WHERE NOT EXISTS (SELECT 1 FROM patient WHERE name = 'Raju M' AND phone = '9988776655');

INSERT INTO patient (name, age, gender, phone)
SELECT 'Demo Staff Patient', 30, 'Other', '9000000000'
WHERE NOT EXISTS (SELECT 1 FROM patient WHERE name = 'Demo Staff Patient' AND phone = '9000000000');

SET @kannan_id = (SELECT patient_id FROM patient WHERE name = 'Kannan V' AND phone = '9876543210' ORDER BY patient_id LIMIT 1);
SET @priya_id = (SELECT patient_id FROM patient WHERE name = 'Priya S' AND phone = '9123456789' ORDER BY patient_id LIMIT 1);
SET @raju_id = (SELECT patient_id FROM patient WHERE name = 'Raju M' AND phone = '9988776655' ORDER BY patient_id LIMIT 1);
SET @staff_patient_id = (SELECT patient_id FROM patient WHERE name = 'Demo Staff Patient' AND phone = '9000000000' ORDER BY patient_id LIMIT 1);

INSERT INTO users (username, password, role, patient_id) VALUES
('admin', '$2b$10$OkFT./XlHWgaXvKaKmLVXuLaXcBL0Ur1J7tTCh9wu07aTORzfoOHi', 'ADMIN', NULL)
ON DUPLICATE KEY UPDATE password = VALUES(password), role = 'ADMIN', patient_id = NULL;

INSERT INTO users (username, password, role, patient_id) VALUES
('staff', '$2b$10$f6X/jYgl0oxNrsec96IuAe3ZryAqfbwfOzlB1IfjvNmYqFHOxSESC', 'USER', @staff_patient_id)
ON DUPLICATE KEY UPDATE password = VALUES(password), role = 'USER', patient_id = VALUES(patient_id);

INSERT INTO users (username, password, role, patient_id) VALUES
('kannanv1', '$2b$10$3Evf2UikYO9kHMYwE1aCQuZiJErqboSXV.vnMSjC0TmSkj1B/tcba', 'USER', @kannan_id)
ON DUPLICATE KEY UPDATE password = VALUES(password), role = 'USER', patient_id = VALUES(patient_id);

INSERT INTO users (username, password, role, patient_id) VALUES
('priyas2', '$2b$10$acvrMXiF/U6UxTrf7LbpSO.5kVv/Y7mABwtgdi5AdNXAgMchjdu/e', 'USER', @priya_id)
ON DUPLICATE KEY UPDATE password = VALUES(password), role = 'USER', patient_id = VALUES(patient_id);

INSERT INTO users (username, password, role, patient_id) VALUES
('rajum3', '$2b$10$8usT//OHMIGoBQ1mrGmZfur7TGhww.uEQP5Hgk9LseUJC01R11zPa', 'USER', @raju_id)
ON DUPLICATE KEY UPDATE password = VALUES(password), role = 'USER', patient_id = VALUES(patient_id);

INSERT INTO doctor (name, specialization, availability)
SELECT 'Dr. Ravi Kumar', 'General', 'Morning'
WHERE NOT EXISTS (SELECT 1 FROM doctor WHERE name = 'Dr. Ravi Kumar' AND specialization = 'General');
INSERT INTO doctor (name, specialization, availability)
SELECT 'Dr. Priya Nair', 'Cardiologist', 'Evening'
WHERE NOT EXISTS (SELECT 1 FROM doctor WHERE name = 'Dr. Priya Nair' AND specialization = 'Cardiologist');
INSERT INTO doctor (name, specialization, availability)
SELECT 'Dr. Arun Mehta', 'Orthopedic', 'Morning'
WHERE NOT EXISTS (SELECT 1 FROM doctor WHERE name = 'Dr. Arun Mehta' AND specialization = 'Orthopedic');
INSERT INTO doctor (name, specialization, availability)
SELECT 'Dr. Sunita Rao', 'Pediatrician', 'Afternoon'
WHERE NOT EXISTS (SELECT 1 FROM doctor WHERE name = 'Dr. Sunita Rao' AND specialization = 'Pediatrician');
INSERT INTO doctor (name, specialization, availability)
SELECT 'Dr. Karan Shah', 'Dermatologist', 'Evening'
WHERE NOT EXISTS (SELECT 1 FROM doctor WHERE name = 'Dr. Karan Shah' AND specialization = 'Dermatologist');
INSERT INTO doctor (name, specialization, availability)
SELECT 'Dr. Meena Pillai', 'Ophthalmologist', 'Morning'
WHERE NOT EXISTS (SELECT 1 FROM doctor WHERE name = 'Dr. Meena Pillai' AND specialization = 'Ophthalmologist');

INSERT INTO patient_report (patient_id, report_type, report_name, report_date, status, result_summary, attachment_path)
SELECT @kannan_id, 'Blood Test', 'CBC + Sugar Test', CURDATE(), 'Reviewed', 'Hemoglobin normal. Fasting sugar slightly elevated.', 'D:\\Reports\\cbc-kannan.pdf'
WHERE NOT EXISTS (SELECT 1 FROM patient_report WHERE patient_id = @kannan_id AND report_name = 'CBC + Sugar Test');

INSERT INTO patient_report (patient_id, report_type, report_name, report_date, status, result_summary, attachment_path)
SELECT @priya_id, 'X-Ray', 'Chest X-Ray', CURDATE(), 'Received', 'Mild congestion visible. Follow-up recommended.', 'D:\\Reports\\priya-chest-xray.jpg'
WHERE NOT EXISTS (SELECT 1 FROM patient_report WHERE patient_id = @priya_id AND report_name = 'Chest X-Ray');
