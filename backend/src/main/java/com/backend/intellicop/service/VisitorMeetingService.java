package com.backend.intellicop.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.intellicop.Repository.CompletedVisitorRepository;
import com.backend.intellicop.Repository.VisitorMeetingRepository;
import com.backend.intellicop.entity.CompletedVisitor;
import com.backend.intellicop.entity.VisitorMeeting;

import jakarta.annotation.PostConstruct;

@Service
public class VisitorMeetingService {

    @Autowired
    private VisitorMeetingRepository visitorMeetingRepository;

    @Autowired
    private CompletedVisitorRepository completedVisitorRepository;

    /** ✅ Fetch all visitor meetings */
    public List<VisitorMeeting> getAllVisitors() {
        return visitorMeetingRepository.findAll();
    }

    /** ✅ Fetch visitors scheduled for a specific date */
    public List<VisitorMeeting> getVisitorsByDate(LocalDate date) {
        return visitorMeetingRepository.findByScheduledDate(date);
    }

    /** ✅ Fetch upcoming visitors (after today) */
    public List<VisitorMeeting> getUpcomingVisitors(LocalDate today) {
        return visitorMeetingRepository.findByScheduledDateAfter(today);
    }

    /** ✅ Schedule a new visitor meeting */
    public VisitorMeeting scheduleVisitor(VisitorMeeting visitor) {
        visitor.setStatus("SCHEDULED");
        return visitorMeetingRepository.save(visitor);
    }

    /** ✅ Update visitor meeting details (reschedule) */
    public VisitorMeeting updateVisitor(Long id, VisitorMeeting updatedVisitor) {
        VisitorMeeting existing = visitorMeetingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Visitor not found"));

        existing.setVisitorName(updatedVisitor.getVisitorName());
        existing.setVisitorContact(updatedVisitor.getVisitorContact());
        existing.setInmateName(updatedVisitor.getInmateName());
        existing.setPurpose(updatedVisitor.getPurpose());
        existing.setScheduledDate(updatedVisitor.getScheduledDate());
        existing.setScheduledTime(updatedVisitor.getScheduledTime());
        existing.setRemarks(updatedVisitor.getRemarks());

        return visitorMeetingRepository.save(existing);
    }

    /** ✅ Delete a visitor */
    public void deleteVisitor(Long id) {
        visitorMeetingRepository.deleteById(id);
    }

    /** ✅ Update visitor status (Completed / Cancelled) */
    @Transactional
    public void updateStatus(Long id, String status) {
        VisitorMeeting meeting = visitorMeetingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Visitor not found"));
        meeting.setStatus(status.toUpperCase());
        visitorMeetingRepository.save(meeting);

        // ✅ If marked as Completed → move to CompletedVisitor table
        if ("COMPLETED".equalsIgnoreCase(status)) {
            CompletedVisitor completed = CompletedVisitor.builder()
                    .visitorName(meeting.getVisitorName())
                    .visitorContact(meeting.getVisitorContact())
                    .inmateName(meeting.getInmateName())
                    .purpose(meeting.getPurpose())
                    .scheduledDate(meeting.getScheduledDate())
                    .scheduledTime(meeting.getScheduledTime())
                    .status("Completed")
                    .remarks(meeting.getRemarks())
                    .createdAt(meeting.getCreatedAt())
                    .build();

            completedVisitorRepository.save(completed);
            visitorMeetingRepository.deleteById(id);
        }
    }

    /** ✅ Get all completed visitors */
    public List<CompletedVisitor> getAllCompletedVisitors() {
        return completedVisitorRepository.findAll();
    }

    /** ✅ Automatically mark past-date visitors as completed at 12:00 AM */
    @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Kolkata") // Runs daily at midnight IST
    @Transactional
    public void autoCompleteExpiredVisitors() {
        processExpiredVisitors("AUTO_COMPLETED");
    }

    /** ✅ Also check past visitors on server startup (in case server was down) */
    @PostConstruct
    @Transactional
    public void checkExpiredVisitorsOnStartup() {
        processExpiredVisitors("STARTUP_AUTO_COMPLETED");
    }

    /** ♻️ Common logic reused by both scheduled & startup methods */
    private void processExpiredVisitors(String statusLabel) {
        LocalDate today = LocalDate.now();

        List<VisitorMeeting> expiredVisitors = visitorMeetingRepository.findAll().stream()
                .filter(v -> v.getScheduledDate().isBefore(today)
                        && !"COMPLETED".equalsIgnoreCase(v.getStatus()))
                .collect(Collectors.toList());

        if (expiredVisitors.isEmpty()) return;

        for (VisitorMeeting meeting : expiredVisitors) {
            CompletedVisitor completed = CompletedVisitor.builder()
                    .visitorName(meeting.getVisitorName())
                    .visitorContact(meeting.getVisitorContact())
                    .inmateName(meeting.getInmateName())
                    .purpose(meeting.getPurpose())
                    .scheduledDate(meeting.getScheduledDate())
                    .scheduledTime(meeting.getScheduledTime())
                    .status(statusLabel)
                    .remarks("Auto-marked as completed (past date).")
                    .createdAt(meeting.getCreatedAt())
                    .build();

            completedVisitorRepository.save(completed);
            visitorMeetingRepository.deleteById(meeting.getId());
        }

        System.out.println("✅ " + statusLabel + ": " + expiredVisitors.size() + " past visitor(s) processed on " + today);
    }
}