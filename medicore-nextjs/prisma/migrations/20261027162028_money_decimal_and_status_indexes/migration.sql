-- AlterTable
ALTER TABLE `billing` MODIFY `amount` DECIMAL(12, 2) NOT NULL;

-- CreateIndex
CREATE INDEX `idx_appointment_status` ON `appointment`(`status`);

-- CreateIndex
CREATE INDEX `idx_billing_payment_status` ON `billing`(`payment_status`);

-- CreateIndex
CREATE INDEX `idx_patient_report_status` ON `patient_report`(`status`);
