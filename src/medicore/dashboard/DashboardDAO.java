package medicore.dashboard;

import medicore.appointment.AppointmentDAO;
import medicore.billing.BillingDAO;
import medicore.doctor.DoctorDAO;
import medicore.medical.MedicalRecordDAO;
import medicore.patient.PatientDAO;

public class DashboardDAO {

    private final PatientDAO patientDAO = new PatientDAO();
    private final DoctorDAO doctorDAO = new DoctorDAO();
    private final AppointmentDAO appointmentDAO = new AppointmentDAO();
    private final MedicalRecordDAO medicalRecordDAO = new MedicalRecordDAO();
    private final BillingDAO billingDAO = new BillingDAO();

    public String[] getSummary() {
        return new String[] {
            String.valueOf(patientDAO.getPatientCount()),
            String.valueOf(doctorDAO.getDoctorCount()),
            String.valueOf(appointmentDAO.getTodayAppointmentCount()),
            String.valueOf(medicalRecordDAO.getTotalRecordCount()),
            String.format("%.2f", billingDAO.getTotalRevenue())
        };
    }
}
