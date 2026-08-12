package com.medicore.dto;

import java.time.LocalDate;

public class HealthSnapshotDto {
    private long activeMedicationsCount;
    private long totalRecordsCount;
    private LocalDate latestLabReportDate;
    private String knownAllergies;
    private LocalDate upcomingFollowUpDate;

    // Getters and Setters
    public long getActiveMedicationsCount() { return activeMedicationsCount; }
    public void setActiveMedicationsCount(long activeMedicationsCount) { this.activeMedicationsCount = activeMedicationsCount; }

    public long getTotalRecordsCount() { return totalRecordsCount; }
    public void setTotalRecordsCount(long totalRecordsCount) { this.totalRecordsCount = totalRecordsCount; }

    public LocalDate getLatestLabReportDate() { return latestLabReportDate; }
    public void setLatestLabReportDate(LocalDate latestLabReportDate) { this.latestLabReportDate = latestLabReportDate; }

    public String getKnownAllergies() { return knownAllergies; }
    public void setKnownAllergies(String knownAllergies) { this.knownAllergies = knownAllergies; }

    public LocalDate getUpcomingFollowUpDate() { return upcomingFollowUpDate; }
    public void setUpcomingFollowUpDate(LocalDate upcomingFollowUpDate) { this.upcomingFollowUpDate = upcomingFollowUpDate; }
}
