package com.backend.intellicop.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.intellicop.Repository.CompletedVisitorRepository;
import com.backend.intellicop.Repository.VisitorMeetingRepository;
import com.backend.intellicop.entity.CompletedVisitor;
import com.backend.intellicop.entity.VisitorMeeting;

@Service
public class VisitorMeetingService {

    @Autowired
    private VisitorMeetingRepository visitorMeetingRepository;

    // ✅ Added for completed visitors
    @Autowired
    private CompletedVisitorRepository completedVisitorRepository;

    /** ✅ Fetch all visitor meetings */
    public List<VisitorMeeting> getAllVisitors() {
        return visitorMeetingRepository.findAll();
    }

    /** ✅ Fetch visitors scheduled for today */
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

            // ✅ Remove from scheduled table (move)
            visitorMeetingRepository.deleteById(id);
        }
    }

    /** ✅ Get all completed visitors */
    public List<CompletedVisitor> getAllCompletedVisitors() {
        return completedVisitorRepository.findAll();
    }
}
